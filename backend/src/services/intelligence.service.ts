import { Anthropic } from '@anthropic-ai/sdk';
import { salaryIntelligenceSystem } from '../prompts/salaryIntelligence.prompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface IntelligenceParams {
  raw_data: any[];
  job_title: string;
  location: string;
  currency: string;
  posted_salary?: number;
}

interface IntelligenceResult {
  median: number;
  p25: number;
  p75: number;
  confidence_explanation: string;
  posted_assessment: string | null;
  negotiation_insight: string;
  market_context: string;
  red_flags: string[];
  green_flags: string[];
}

class IntelligenceService {
  async analyze(params: IntelligenceParams): Promise<IntelligenceResult> {
    try {
      // First try statistical analysis
      const stats = this.statisticalAnalysis(params.raw_data);
      
      // If we have enough data, use Claude for deeper analysis
      if (params.raw_data.length >= 5) {
        const aiResult = await this.aiAnalysis(params, stats);
        return {
          ...stats,
          ...aiResult,
        };
      }

      // Fallback to statistical analysis only
      return {
        ...stats,
        confidence_explanation: params.raw_data.length > 0 
          ? `Based on ${params.raw_data.length} data points`
          : 'Not enough data for this role',
        posted_assessment: params.posted_salary ? this.assessPostedSalary(params.posted_salary, stats) : null,
        negotiation_insight: '',
        market_context: '',
        red_flags: [],
        green_flags: [],
      };
    } catch (error) {
      console.error('Error analyzing salary data:', error);
      
      // Fallback to basic stats even if AI fails
      const stats = this.statisticalAnalysis(params.raw_data);
      return {
        ...stats,
        confidence_explanation: 'Analysis service temporarily unavailable',
        posted_assessment: params.posted_salary ? this.assessPostedSalary(params.posted_salary, stats) : null,
        negotiation_insight: '',
        market_context: '',
        red_flags: [],
        green_flags: [],
      };
    }
  }

  private statisticalAnalysis(data: any[]): { median: number; p25: number; p75: number } {
    if (data.length === 0) {
      return { median: 0, p25: 0, p75: 0 };
    }

    // Extract medians and sort
    const salaries = data
      .filter(d => d.salary_median && d.salary_median > 0)
      .map(d => d.salary_median)
      .sort((a, b) => a - b);

    if (salaries.length === 0) {
      return { median: 0, p25: 0, p75: 0 };
    }

    const median = this.getMedian(salaries);
    const p25 = this.getPercentile(salaries, 25);
    const p75 = this.getPercentile(salaries, 75);

    return { median, p25, p75 };
  }

  private async aiAnalysis(params: IntelligenceParams, stats: any): Promise<any> {
    const prompt = salaryIntelligenceSystem
      .replace('{raw_data_json}', JSON.stringify(params.raw_data))
      .replace('{job_title}', params.job_title)
      .replace('{location}', params.location)
      .replace('{currency}', params.currency)
      .replace('{posted_salary}', params.posted_salary?.toString() || 'null');

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a compensation intelligence analyst. Return JSON only.',
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        return {};
      }
    }

    return {};
  }

  private assessPostedSalary(posted: number, stats: { median: number }): string {
    const diff = ((posted - stats.median) / stats.median) * 100;
    
    if (diff < -15) {
      return 'Below market rate - significant room for negotiation';
    } else if (diff < -5) {
      return 'Slightly below market - room for negotiation';
    } else if (diff <= 10) {
      return 'Fair market rate';
    } else {
      return 'Above market rate';
    }
  }

  private getMedian(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    
    return sorted[mid];
  }

  private getPercentile(arr: number[], percentile: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(percentile / 100 * sorted.length);
    return sorted[index - 1];
  }
}

export default new IntelligenceService();