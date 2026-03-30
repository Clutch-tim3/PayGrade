import h1bSource from './h1b.source';
import glassdoorSource from './glassdoor.source';
import userSubmittedSource from './userSubmitted.source';
import fxService from '../fx.service';

interface SearchParams {
  job_title: string;
  company?: string;
  location?: string;
  country_code: string;
  currency: string;
  seniority_hint?: string;
  employment_type?: string;
  posted_salary_text?: string;
}

class CompositeSource {
  async search(params: SearchParams): Promise<any[]> {
    const [h1bData, glassdoorData, userData] = await Promise.all([
      h1bSource.search(params),
      glassdoorSource.search(params),
      userSubmittedSource.search(params),
    ]);

    const allData = [...h1bData, ...glassdoorData, ...userData];
    
    // Convert all salaries to target currency
    const convertedData = await Promise.all(
      allData.map(async (item) => {
        const min = item.salary_min 
          ? await fxService.convert(item.salary_min, item.currency, params.currency)
          : null;
        const max = item.salary_max 
          ? await fxService.convert(item.salary_max, item.currency, params.currency)
          : null;
        const median = item.salary_median 
          ? await fxService.convert(item.salary_median, item.currency, params.currency)
          : null;

        return {
          ...item,
          salary_min: min,
          salary_max: max,
          salary_median: median,
          currency: params.currency,
        };
      })
    );

    return convertedData.filter(item => item.salary_min && item.salary_max);
  }
}

export default new CompositeSource();