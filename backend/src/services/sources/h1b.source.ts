import prisma from '../../config/database';

interface H1BSearchParams {
  job_title: string;
  company?: string;
  location?: string;
  country_code: string;
}

class H1BSource {
  async search(params: H1BSearchParams): Promise<any[]> {
    // H1B data is primarily US-based
    if (params.country_code !== 'US') {
      return [];
    }

    try {
      const query = `
        SELECT 
          job_title_raw,
          job_title_norm,
          company_name,
          wage_rate_of_pay_from as salary_min,
          wage_rate_of_pay_to as salary_max,
          (wage_rate_of_pay_from + wage_rate_of_pay_to) / 2 as salary_median,
          'USD' as currency,
          worksite_city as city,
          worksite_state as state,
          'h1b' as source,
          employment_start_date as source_date,
          0.9 as confidence
        FROM h1b_salaries 
        WHERE 
          to_tsvector('english', job_title_norm) @@ to_tsquery('english', $1)
          ${params.company ? `AND company_name ILIKE $2` : ''}
          ${params.location ? `AND (worksite_city ILIKE $3 OR worksite_state ILIKE $3)` : ''}
        ORDER BY 
          employment_start_date DESC
        LIMIT 50
      `;

      const values = [
        params.job_title.toLowerCase().split(' ').join(' & '),
        ...(params.company ? [`%${params.company.toLowerCase()}%`] : []),
        ...(params.location ? [`%${params.location.toLowerCase()}%`] : []),
      ];

      const result = await prisma.$queryRawUnsafe(query, ...values);
      return result as any[];
    } catch (error) {
      console.error('Error searching H1B data:', error);
      return [];
    }
  }
}

export default new H1BSource();