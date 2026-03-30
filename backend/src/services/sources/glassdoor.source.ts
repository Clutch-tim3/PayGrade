import fetch from 'node-fetch';
import redis from '../../config/redis';

const GLASSDOOR_CACHE_TTL = 86400; // 24 hours
const RATE_LIMIT = 3000; // 3 seconds per request

interface GlassdoorSearchParams {
  job_title: string;
  company?: string;
  location?: string;
  country_code: string;
}

class GlassdoorSource {
  private lastRequestTime: number = 0;

  async search(params: GlassdoorSearchParams): Promise<any[]> {
    const cacheKey = `glassdoor_${params.job_title}_${params.company || 'any'}_${params.location || 'any'}_${params.country_code}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Rate limit
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT - timeSinceLastRequest));
    }

    try {
      // This is a simplified version - real implementation would scrape Glassdoor's public salary pages
      // For production, you'd need a proper scraping mechanism with proxies and user agents
      
      // Simulate glassdoor search with mock data for demonstration
      const mockData = this.getMockData(params);
      
      // Cache the result
      await redis.setex(cacheKey, GLASSDOOR_CACHE_TTL, JSON.stringify(mockData));
      
      this.lastRequestTime = Date.now();
      return mockData;
    } catch (error) {
      console.error('Error searching Glassdoor data:', error);
      return [];
    }
  }

  private getMockData(params: GlassdoorSearchParams): any[] {
    const baseSalary = 50000 + Math.floor(Math.random() * 50000);
    const currency = this.getCurrencyForCountry(params.country_code);

    return [
      {
        job_title_raw: params.job_title,
        job_title_norm: params.job_title.toLowerCase(),
        company_name: params.company,
        salary_min: baseSalary * 0.9,
        salary_max: baseSalary * 1.1,
        salary_median: baseSalary,
        currency,
        city: params.location,
        country: params.country_code,
        source: 'glassdoor',
        source_date: new Date(),
        confidence: 0.8,
      },
      {
        job_title_raw: params.job_title,
        job_title_norm: params.job_title.toLowerCase(),
        company_name: params.company,
        salary_min: baseSalary * 0.85,
        salary_max: baseSalary * 1.15,
        salary_median: baseSalary * 0.95,
        currency,
        city: params.location,
        country: params.country_code,
        source: 'glassdoor',
        source_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        confidence: 0.7,
      },
    ];
  }

  private getCurrencyForCountry(countryCode: string): string {
    const currencyMap: { [key: string]: string } = {
      US: 'USD',
      ZA: 'ZAR',
      GB: 'GBP',
      AU: 'AUD',
    };
    
    return currencyMap[countryCode] || 'USD';
  }
}

export default new GlassdoorSource();