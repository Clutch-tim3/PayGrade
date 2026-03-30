import crypto from 'crypto';
import prisma from '../config/database';
import redis from '../config/redis';
import normalisationService from './normalisation.service';
import compositeSource from './sources/composite.source';
import intelligenceService from './intelligence.service';
import fxService from './fx.service';

interface SalaryLookupParams {
  job_title: string;
  company?: string;
  location?: string;
  country_code: string;
  currency: string;
  seniority_hint?: string;
  employment_type?: string;
  posted_salary_text?: string;
}

interface SalaryIntelligence {
  role_detected: string;
  location: string;
  currency: string;
  range: {
    min: number;
    p25: number;
    median: number;
    p75: number;
    max: number;
  };
  confidence: 'high' | 'medium' | 'low';
  data_points: number;
  sources: Array<{ source: string; count: number }>;
  posted_salary_assessment?: {
    posted: number;
    vs_market: 'below' | 'fair' | 'above';
    pct_diff: number;
    label: string;
  };
  negotiation_insight?: string;
  company_data?: any;
  similar_roles?: Array<{ title: string; company: string; range: string }>;
  trends?: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  remote_adjustment?: {
    remote_pct: number;
    adjusted_range: {
      min: number;
      median: number;
      max: number;
    };
  };
  cost_of_living?: {
    index: number;
    compared_to_national_avg: number;
    salary_adjustment: number;
  };
  experience_breakdown?: Array<{
    level: string;
    min: number;
    median: number;
    max: number;
    count: number;
  }>;
  education_breakdown?: Array<{
    level: string;
    min: number;
    median: number;
    max: number;
    count: number;
  }>;
  skill_adjustments?: Array<{
    skill: string;
    adjustment: number;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }>;
  company_reputation?: {
    score: number;
    salary_fairness: 'below' | 'fair' | 'above';
    review_count: number;
    benefits_rating: number;
  };
  job_keywords?: Array<{
    keyword: string;
    salary_impact: number;
    category: 'technical' | 'soft' | 'certification';
  }>;
}

class SalaryService {
  async lookup(params: SalaryLookupParams): Promise<SalaryIntelligence> {
    // Create cache key
    const cacheKey = crypto
      .createHash('sha256')
      .update([
        params.job_title.toLowerCase(),
        params.location?.toLowerCase() || '',
        params.country_code,
        params.currency,
      ].join('|'))
      .digest('hex');

    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Normalise job title
    const normalised = await normalisationService.normaliseJobTitle(params.job_title);
    
    // Search all data sources
    const dataPoints = await compositeSource.search({
      ...params,
      job_title: normalised.normalised,
    });

    // Extract posted salary if available
    const postedSalary = this.extractSalaryFromText(params.posted_salary_text);

    // Analyze salary data
    const analysis = await intelligenceService.analyze({
      raw_data: dataPoints,
      job_title: normalised.normalised,
      location: params.location || 'Unknown',
      currency: params.currency,
      posted_salary: postedSalary,
    });

    // Calculate additional statistics
    const stats = this.calculateRange(dataPoints);
    const confidence = this.calculateConfidence(dataPoints);
    const sources = this.countBySource(dataPoints);

     const intelligence: SalaryIntelligence = {
      role_detected: normalised.normalised,
      location: params.location || 'Unknown',
      currency: params.currency,
      range: {
        min: stats.min,
        p25: analysis.p25,
        median: analysis.median,
        p75: analysis.p75,
        max: stats.max,
      },
      confidence,
      data_points: dataPoints.length,
      sources,
      negotiation_insight: analysis.negotiation_insight,
      ...(postedSalary && {
        posted_salary_assessment: this.assessPostedSalary(postedSalary, analysis.median, params.currency),
      }),
      ...(params.company && this.getCompanyData(dataPoints)),
      similar_roles: this.getSimilarRoles(dataPoints),
      trends: this.calculateTrends(dataPoints),
      remote_adjustment: this.calculateRemoteAdjustment(dataPoints),
      cost_of_living: this.calculateCostOfLiving(),
      experience_breakdown: this.getExperienceBreakdown(dataPoints),
      education_breakdown: this.getEducationBreakdown(dataPoints),
      skill_adjustments: this.getSkillAdjustments(),
      company_reputation: this.getCompanyReputation(),
      job_keywords: this.getJobKeywords(params.posted_salary_text || ''),
    };

    // Cache the result (24 hours)
    const cacheTTL = 86400;
    await redis.setex(cacheKey, cacheTTL, JSON.stringify(intelligence));

    return intelligence;
  }

  async submitSalary(data: any): Promise<{ credits_earned: number }> {
    // Create a unique hash for duplicate prevention
    const submissionHash = crypto
      .createHash('sha256')
      .update([
        data.job_title.toLowerCase(),
        data.company_name?.toLowerCase() || '',
        data.total_comp.toString(),
        data.currency,
        data.city.toLowerCase(),
        data.country,
      ].join('|'))
      .digest('hex');

    try {
      await prisma.userSalarySubmission.create({
        data: {
          ...data,
          submission_hash: submissionHash,
        },
      });
    } catch (error) {
      // Duplicate submission - return 0 credits
      return { credits_earned: 0 };
    }

    return { credits_earned: 2 };
  }

  private calculateRange(data: any[]): { min: number; max: number } {
    if (data.length === 0) {
      return { min: 0, max: 0 };
    }

    const salaries = data.map(d => ({
      min: d.salary_min,
      max: d.salary_max,
    }));

    const allMins = salaries.map(s => s.min).filter(n => n > 0);
    const allMaxs = salaries.map(s => s.max).filter(n => n > 0);

    return {
      min: allMins.length > 0 ? Math.min(...allMins) : 0,
      max: allMaxs.length > 0 ? Math.max(...allMaxs) : 0,
    };
  }

  private calculateConfidence(data: any[]): 'high' | 'medium' | 'low' {
    if (data.length >= 20) return 'high';
    if (data.length >= 10) return 'medium';
    return 'low';
  }

  private countBySource(data: any[]): Array<{ source: string; count: number }> {
    const counts: { [key: string]: number } = {};
    data.forEach(d => {
      counts[d.source] = (counts[d.source] || 0) + 1;
    });
    return Object.entries(counts).map(([source, count]) => ({
      source,
      count,
    }));
  }

  private assessPostedSalary(posted: number, median: number, currency: string) {
    const pctDiff = ((posted - median) / median) * 100;
    let vsMarket: 'below' | 'fair' | 'above';
    let label: string;

    if (pctDiff < -15) {
      vsMarket = 'below';
      label = 'Below market - significant room to negotiate';
    } else if (pctDiff < -5) {
      vsMarket = 'below';
      label = 'Slightly below market - room to negotiate';
    } else if (pctDiff <= 10) {
      vsMarket = 'fair';
      label = 'Fair market rate';
    } else {
      vsMarket = 'above';
      label = 'Above market rate';
    }

    return {
      posted,
      vs_market: vsMarket,
      pct_diff: Math.round(pctDiff),
      label,
    };
  }

  private getCompanyData(data: any[]): { company_data?: any } {
    if (data.length < 3) return {};

    const companyStats = {
      total: data.length,
      average_min: Math.round(data.reduce((sum, d) => sum + d.salary_min, 0) / data.length),
      average_max: Math.round(data.reduce((sum, d) => sum + d.salary_max, 0) / data.length),
      positions: this.getUniquePositions(data),
    };

    return { company_data: companyStats };
  }

  private getUniquePositions(data: any[]): Array<{ title: string; range: string }> {
    const positions = new Map<string, { min: number; max: number; count: number }>();

    data.forEach(d => {
      const title = d.job_title_norm;
      if (!positions.has(title)) {
        positions.set(title, { min: d.salary_min, max: d.salary_max, count: 1 });
      } else {
        const existing = positions.get(title)!;
        positions.set(title, {
          min: Math.min(existing.min, d.salary_min),
          max: Math.max(existing.max, d.salary_max),
          count: existing.count + 1,
        });
      }
    });

    return Array.from(positions.entries()).map(([title, stats]) => ({
      title,
      range: `${stats.min.toLocaleString()} - ${stats.max.toLocaleString()}`,
    })).slice(0, 3);
  }

  private getSimilarRoles(data: any[]): Array<{ title: string; company: string; range: string }> {
    // Simple implementation - would need more sophisticated logic in production
    const roles = data.slice(0, 3).map(d => ({
      title: d.job_title_raw,
      company: d.company_name || 'Unknown',
      range: `${Math.round(d.salary_min).toLocaleString()} - ${Math.round(d.salary_max).toLocaleString()}`,
    }));

    return roles;
  }

  private calculateTrends(data: any[]): { oneYear: number; threeYear: number; fiveYear: number } {
    // Calculate salary trend percentages (simulated data for now)
    return {
      oneYear: Math.floor(Math.random() * 15) - 5,
      threeYear: Math.floor(Math.random() * 25) - 5,
      fiveYear: Math.floor(Math.random() * 40) - 5,
    };
  }

  private calculateRemoteAdjustment(data: any[]): { remote_pct: number; adjusted_range: { min: number; median: number; max: number } } {
    // Calculate remote work adjustment (simulated)
    const remotePct = -8 + Math.random() * 4; // Typically 5-12% lower for remote
    const median = data.length > 0 ? data.reduce((sum, d) => sum + (d.salary_median || (d.salary_min + d.salary_max) / 2), 0) / data.length : 0;
    
    return {
      remote_pct: Math.round(remotePct),
      adjusted_range: {
        min: Math.round((data.reduce((sum, d) => sum + d.salary_min, 0) / data.length) * (1 + remotePct / 100)),
        median: Math.round(median * (1 + remotePct / 100)),
        max: Math.round((data.reduce((sum, d) => sum + d.salary_max, 0) / data.length) * (1 + remotePct / 100)),
      },
    };
  }

  private calculateCostOfLiving(): { index: number; compared_to_national_avg: number; salary_adjustment: number } {
    // Calculate cost of living adjustment (simulated)
    const costIndex = 80 + Math.random() * 40; // 80-120 index
    const nationalAvg = 100;
    const adjustment = Math.round((costIndex - nationalAvg));
    
    return {
      index: Math.round(costIndex),
      compared_to_national_avg: Math.round(costIndex - nationalAvg),
      salary_adjustment: adjustment,
    };
  }

  private getExperienceBreakdown(data: any[]): Array<{ level: string; min: number; median: number; max: number; count: number }> {
    // Experience level breakdown (simulated)
    const levels = ['Entry', 'Mid', 'Senior', 'Lead', 'Principal'];
    return levels.map(level => ({
      level,
      min: Math.round(300000 + Math.random() * 200000),
      median: Math.round(500000 + Math.random() * 300000),
      max: Math.round(700000 + Math.random() * 400000),
      count: Math.floor(Math.random() * 20) + 5,
    }));
  }

  private getEducationBreakdown(data: any[]): Array<{ level: string; min: number; median: number; max: number; count: number }> {
    // Education level breakdown (simulated)
    const levels = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'];
    return levels.map(level => ({
      level,
      min: Math.round(250000 + Math.random() * 150000),
      median: Math.round(450000 + Math.random() * 250000),
      max: Math.round(650000 + Math.random() * 350000),
      count: Math.floor(Math.random() * 15) + 3,
    }));
  }

  private getSkillAdjustments(): Array<{ skill: string; adjustment: number; level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }> {
    // Skill-based adjustments (simulated)
    const skills = [
      { name: 'React', levels: ['intermediate', 'advanced', 'expert'] },
      { name: 'Node.js', levels: ['intermediate', 'advanced', 'expert'] },
      { name: 'AWS', levels: ['intermediate', 'advanced'] },
      { name: 'Data Science', levels: ['advanced', 'expert'] },
    ];
    
    return skills.flatMap(skill => {
      return skill.levels.map(level => ({
        skill: skill.name,
        adjustment: Math.floor(Math.random() * 15) + 5,
        level: level as 'beginner' | 'intermediate' | 'advanced' | 'expert',
      }));
    });
  }

  private getCompanyReputation(): { score: number; salary_fairness: 'below' | 'fair' | 'above'; review_count: number; benefits_rating: number } {
    // Company reputation (simulated)
    const score = Math.floor(Math.random() * 50) + 50;
    const salaryFairness = Math.random() > 0.6 ? 'above' : Math.random() > 0.3 ? 'fair' : 'below';
    
    return {
      score,
      salary_fairness: salaryFairness,
      review_count: Math.floor(Math.random() * 200) + 20,
      benefits_rating: Math.floor(Math.random() * 3) + 3,
    };
  }

  private getJobKeywords(jobDescription: string): Array<{ keyword: string; salary_impact: number; category: 'technical' | 'soft' | 'certification' }> {
    // Job description keyword analysis (simulated)
    const technicalKeywords = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'];
    const softKeywords = ['Leadership', 'Communication', 'Problem Solving', 'Team Player'];
    const certKeywords = ['AWS Certified', 'PMP', 'Scrum Master', 'Azure Certified'];
    
    const allKeywords = [
      ...technicalKeywords.map(k => ({ keyword: k, category: 'technical' as const })),
      ...softKeywords.map(k => ({ keyword: k, category: 'soft' as const })),
      ...certKeywords.map(k => ({ keyword: k, category: 'certification' as const })),
    ];
    
    return allKeywords
      .filter(() => Math.random() > 0.5)
      .slice(0, 5)
      .map(keyword => ({
        ...keyword,
        salary_impact: Math.floor(Math.random() * 10) + 2,
      }));
  }

  private extractSalaryFromText(text: string | undefined): number | undefined {
    if (!text) return undefined;

    // Extract possible salary numbers
    const matches = text.match(/(\d{3,6})(?:[,\.]\d{0,3})?(?:\s*-\s*(\d{3,6})(?:[,\.]\d{0,3})?)?/g);
    if (!matches) return undefined;

    const numbers = matches.flatMap(match => {
      const parts = match.split('-').map(s => parseFloat(s.replace(/[^\d.]/g, '')));
      return parts.filter(n => n > 0);
    });

    if (numbers.length === 0) return undefined;

    // Determine if it's per year, month, or hour
    const isHourly = /per\s*hour|hourly/i.test(text);
    const isMonthly = /per\s*month|monthly/i.test(text);
    const isYearly = /per\s*year|yearly|annually/i.test(text);

    // Calculate annual salary
    const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    
    if (isHourly) {
      return avg * 2080; // 40 hours/week * 52 weeks
    } else if (isMonthly) {
      return avg * 12;
    } else if (isYearly || avg > 10000) {
      return avg;
    } else {
      // Assume monthly if between 1000-10000
      return avg * 12;
    }
  }
}

export default new SalaryService();