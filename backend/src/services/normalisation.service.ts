import { Anthropic } from '@anthropic-ai/sdk';
import { titleNormalisationSystem } from '../prompts/titleNormalisation.prompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface NormalisedJobTitle {
  normalised: string;
  seniority: string;
  function: string;
}

class NormalisationService {
  async normaliseJobTitle(jobTitle: string): Promise<NormalisedJobTitle> {
    try {
      // First try simple rule-based normalisation for speed
      const ruleBased = this.ruleBasedNormalisation(jobTitle);
      if (ruleBased) {
        return ruleBased;
      }

      // Fallback to Claude for complex titles
      return await this.aiBasedNormalisation(jobTitle);
    } catch (error) {
      console.error('Error normalising job title:', error);
      // Last resort: simple lowercase without processing
      return {
        normalised: jobTitle.toLowerCase().trim(),
        seniority: 'mid',
        function: 'other',
      };
    }
  }

  private ruleBasedNormalisation(jobTitle: string): NormalisedJobTitle | null {
    const title = jobTitle.toLowerCase().trim();
    
    // Seniority detection
    let seniority = 'mid';
    if (title.includes('junior') || title.includes('jr ') || title.includes('entry')) {
      seniority = 'junior';
    } else if (title.includes('senior') || title.includes('sr ') || title.includes('iii ') || title.includes('l5')) {
      seniority = 'senior';
    } else if (title.includes('lead') || title.includes('principal') || title.includes('architect')) {
      seniority = 'lead';
    } else if (title.includes('director')) {
      seniority = 'director';
    } else if (title.includes('vp') || title.includes('vice president')) {
      seniority = 'vp';
    } else if (title.includes('c-level') || title.includes('ceo') || title.includes('cto') || title.includes('coo') || title.includes('cfo')) {
      seniority = 'c-level';
    }

    // Function detection
    let functionType = 'other';
    if (title.includes('software') || title.includes('developer') || title.includes('engineer') || title.includes('swe')) {
      functionType = 'engineering';
    } else if (title.includes('product') || title.includes('pm')) {
      functionType = 'product';
    } else if (title.includes('design') || title.includes('ux') || title.includes('ui')) {
      functionType = 'design';
    } else if (title.includes('marketing')) {
      functionType = 'marketing';
    } else if (title.includes('sales')) {
      functionType = 'sales';
    } else if (title.includes('data') || title.includes('analyst') || title.includes('scientist')) {
      functionType = 'data';
    } else if (title.includes('finance') || title.includes('accounting')) {
      functionType = 'finance';
    } else if (title.includes('hr') || title.includes('human resources')) {
      functionType = 'hr';
    }

    // Clean title
    let normalised = title
      .replace(/jr\.?|sr\.?|senior|junior|lead|principal|director|vp|vice president|c-level|ceo|cto|coo|cfo/gi, '')
      .replace(/l[0-9]|ic[0-9]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Expand abbreviations
    normalised = normalised
      .replace(/pm\b/gi, 'product manager')
      .replace(/swe\b/gi, 'software engineer')
      .replace(/em\b/gi, 'engineering manager')
      .replace(/ux\b/gi, 'user experience')
      .replace(/ui\b/gi, 'user interface');

    return {
      normalised,
      seniority,
      function: functionType,
    };
  }

  private async aiBasedNormalisation(jobTitle: string): Promise<NormalisedJobTitle> {
    const prompt = `Normalise this job title: "${jobTitle}"`;

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: titleNormalisationSystem,
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
        return this.ruleBasedNormalisation(jobTitle)!;
      }
    }

    return this.ruleBasedNormalisation(jobTitle)!;
  }
}

export default new NormalisationService();