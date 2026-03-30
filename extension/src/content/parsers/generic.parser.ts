import { JobData } from '../../types/salary.types';

class GenericParser {
  async parse(): Promise<JobData | null> {
    try {
      // Try various common selectors for job data
      const titleElement = this.findTitleElement();
      const companyElement = this.findCompanyElement();
      const locationElement = this.findLocationElement();
      const salaryElement = this.findSalaryElement();
      const descriptionElement = this.findDescriptionElement();

      if (!titleElement) {
        return null;
      }

      const jobTitle = titleElement.textContent?.trim() || '';
      const company = companyElement?.textContent?.trim() || '';
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
      console.error('Generic parser error:', error);
      return null;
    }
  }

  private findTitleElement(): Element | null {
    const selectors = [
      'h1[itemprop="title"]',
      'h1[class*="title"]',
      'h1[class*="job"]',
      '[data-testid*="title"]',
      'h1',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && this.isJobTitle(element.textContent || '')) {
        return element;
      }
    }

    return null;
  }

  private findCompanyElement(): Element | null {
    const selectors = [
      '[itemprop="hiringOrganization"]',
      '[itemprop="name"]',
      '[class*="company"]',
      '[data-testid*="company"]',
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element.textContent && !element.textContent.includes('Apply')) {
          return element;
        }
      }
    }

    return null;
  }

  private findLocationElement(): Element | null {
    const selectors = [
      '[itemprop="jobLocation"]',
      '[class*="location"]',
      '[data-testid*="location"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }

    return null;
  }

  private findSalaryElement(): Element | null {
    const selectors = [
      '[itemprop="baseSalary"]',
      '[class*="salary"]',
      '[data-testid*="salary"]',
      '[class*="compensation"]',
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent || '';
        if (text.includes('$') || text.includes('R') || text.includes('£') || text.includes('€')) {
          return element;
        }
      }
    }

    return null;
  }

  private findDescriptionElement(): Element | null {
    const selectors = [
      '[itemprop="description"]',
      '[class*="description"]',
      '[class*="job-detail"]',
      '[class*="job-body"]',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent && element.textContent.length > 100) {
        return element;
      }
    }

    return null;
  }

  private isJobTitle(text: string): boolean {
    // Simple heuristic to check if text looks like a job title
    const titleKeywords = ['software', 'engineer', 'developer', 'manager', 'designer', 'analyst', 'specialist'];
    return titleKeywords.some(keyword => text.toLowerCase().includes(keyword)) || 
           text.split(' ').length <= 10;
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
    const possibleJobPaths = ['/job', '/careers', '/positions', '/opportunities'];
    return possibleJobPaths.some(path => window.location.pathname.includes(path));
  }
}

export default new GenericParser();