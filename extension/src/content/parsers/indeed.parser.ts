import { JobData } from '../../types/salary.types';

class IndeedParser {
  async parse(): Promise<JobData | null> {
    try {
      const titleElement = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]');
      const companyElement = document.querySelector('[data-testid="inlineHeader-companyName"]');
      const locationElement = document.querySelector('[data-testid="job-location"]');
      const salaryElement = document.querySelector('[data-testid="attribute_snippet_testid"]');
      
      // Description might be in different selectors
      const descriptionElement = document.querySelector('#jobDescriptionText') || 
                                 document.querySelector('[data-testid="jobDescriptionText"]');

      if (!titleElement || !companyElement) {
        return null;
      }

      const jobTitle = titleElement.textContent?.trim() || '';
      const company = companyElement.textContent?.trim() || '';
      const location = locationElement?.textContent?.trim() || '';
      const postedSalary = salaryElement?.textContent?.trim() || null;
      const description = descriptionElement?.textContent?.trim() || '';

      // Check if remote
      const remote = !!document.querySelector('[data-remote-job="true"]') || 
                     location.toLowerCase().includes('remote');

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
      console.error('Indeed parser error:', error);
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
    return window.location.pathname.includes('/viewjob') && 
           !!document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]');
  }
}

export default new IndeedParser();