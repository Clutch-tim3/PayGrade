import { JobData } from '../types/salary.types';
import linkedinParser from './parsers/linkedin.parser';
import indeedParser from './parsers/indeed.parser';
import careers24Parser from './parsers/careers24.parser';
import seekParser from './parsers/seek.parser';
import genericParser from './parsers/generic.parser';

class JobBoardDetector {
  private parsers = [
    { name: 'LinkedIn', parser: linkedinParser, isJobPage: () => {
      return window.location.hostname.includes('linkedin') && window.location.pathname.includes('/jobs/view/') && 
             !!document.querySelector('.job-details-jobs-unified-top-card__job-title');
    }},
    { name: 'Indeed', parser: indeedParser, isJobPage: () => {
      return window.location.hostname.includes('indeed') && window.location.pathname.includes('/viewjob') && 
             !!document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]');
    }},
    { name: 'Careers24', parser: careers24Parser, isJobPage: () => {
      return window.location.hostname.includes('careers24') && window.location.pathname.includes('/job/') && 
             !!document.querySelector('.job-header h1');
    }},
    { name: 'Seek', parser: seekParser, isJobPage: () => {
      return window.location.hostname.includes('seek') && window.location.pathname.includes('/job/') && 
             !!document.querySelector('[data-automation="job-detail-title"]');
    }},
    { name: 'Generic', parser: genericParser, isJobPage: () => {
      const possibleJobPaths = ['/job', '/careers', '/positions', '/opportunities'];
      return possibleJobPaths.some(path => window.location.pathname.includes(path));
    }},
  ];

  async detectJobData(): Promise<JobData | null> {
    // Find the appropriate parser
    const parserEntry = this.parsers.find(entry => {
      try {
        return entry.isJobPage();
      } catch (error) {
        console.error(`Error checking ${entry.name} parser:`, error);
        return false;
      }
    });

    if (!parserEntry) {
      console.log('No matching parser found for this job board');
      return null;
    }

    console.log(`Using ${parserEntry.name} parser`);
    
    return parserEntry.parser.parse();
  }

  private observer: MutationObserver | null = null;
  private currentUrl: string | null = null;

  // Watch for changes in the DOM to detect when job listings load (SPA)
  watchForJobChanges(callback: (jobData: JobData) => void): void {
    // Initial check
    this.checkAndParse(callback);

    // Watch for URL changes (SPA navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = ((state, title, url) => {
      const result = originalPushState.apply(history, [state, title, url]);
      this.checkAndParse(callback);
      return result;
    });

    history.replaceState = ((state, title, url) => {
      const result = originalReplaceState.apply(history, [state, title, url]);
      this.checkAndParse(callback);
      return result;
    });

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
      this.checkAndParse(callback);
    });

    // MutationObserver to watch for DOM changes
    this.observer = new MutationObserver(() => {
      this.checkAndParse(callback);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private async checkAndParse(callback: (jobData: JobData) => void): Promise<void> {
    const currentUrl = window.location.href;
    
    // Don't parse the same URL twice
    if (currentUrl === this.currentUrl) {
      return;
    }

    this.currentUrl = currentUrl;

    // Wait for DOM to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    const jobData = await this.detectJobData();
    if (jobData) {
      callback(jobData);
    }
  }

  stopWatching(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.currentUrl = null;
  }
}

export default new JobBoardDetector();