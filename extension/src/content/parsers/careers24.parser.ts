import { JobData } from '../../types/salary.types';

class Careers24Parser {
  async parse(): Promise<JobData | null> {
    try {
      const titleElement = document.querySelector('.job-header h1');
      const companyElement = document.querySelector('.company-name');
      const locationElement = document.querySelector('.location-label');
      const salaryElement = document.querySelector('.salary-label');
      
      // Description selector might vary
      const descriptionElement = document.querySelector('.job-description') || 
                                 document.querySelector('.description');

      if (!titleElement || !companyElement) {
        return null;
      }

      const jobTitle = titleElement.textContent?.trim() || '';
      const company = companyElement.textContent?.trim() || '';
      const location = locationElement?.textContent?.trim() || '';
      const postedSalary = salaryElement?.textContent?.trim() || null;
      const description = descriptionElement?.textContent?.trim() || '';

      // Check if remote
      const remote = location.toLowerCase().includes('remote') || 
                     description.toLowerCase().includes('remote');

      // Extract seniority level from title
      const seniorityLevel = this.extractSeniority(jobTitle);
      
      // Extract employment type from description or other elements
      const employmentType = this.extractEmploymentType(description);

      return {
        jobTitle,
        company,
        location,
        postedSalary,
        description,
        employmentType,
        seniorityLevel,
        remote,
        url: window.location.href,
      };
    } catch (error) {
      console.error('Careers24 parser error:', error);
      return null;
    }
  }

  private extractSeniority(title: string): string | null {
    const lowerTitle = title.toLowerCase();
    const seniorityPatterns = [
      { regex: /junior|jr\b/i, level: 'junior' },
      { regex: /senior|sr\b|iii\b/i, level: 'senior' },
      { regex: /lead|principal|architect/i, level: 'lead' },
      { regex: /director/i, level: 'director' },
      { regex: /vp|vice president/i, level: 'vp' },
      { regex: /c-level|ceo|cto|coo|cfo/i, level: 'c-level' },
    ];

    for (const { regex, level } of seniorityPatterns) {
      if (regex.test(lowerTitle)) {
        return level;
      }
    }

    return null;
  }

  private extractEmploymentType(description: string): string | null {
    const lowerDesc = description.toLowerCase();
    const typePatterns = [
      { regex: /full.*time|fulltime/i, type: 'full-time' },
      { regex: /part.*time|parttime/i, type: 'part-time' },
      { regex: /contract/i, type: 'contract' },
      { regex: /temporary/i, type: 'temporary' },
      { regex: /internship/i, type: 'internship' },
    ];

    for (const { regex, type } of typePatterns) {
      if (regex.test(lowerDesc)) {
        return type;
      }
    }

    return null;
  }

  // Check if this is a job detail page
  static isJobPage(): boolean {
    return window.location.pathname.includes('/job/') && 
           !!document.querySelector('.job-header h1');
  }
}

export default new Careers24Parser();