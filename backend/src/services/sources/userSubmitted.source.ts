import prisma from '../../config/database';

interface UserSubmittedSearchParams {
  job_title: string;
  company?: string;
  location?: string;
  country_code: string;
}

class UserSubmittedSource {
  async search(params: UserSubmittedSearchParams): Promise<any[]> {
    try {
      const query = `
        SELECT 
          job_title as job_title_raw,
          lower(job_title) as job_title_norm,
          company_name,
          base_salary as salary_min,
          total_comp as salary_max,
          base_salary as salary_median,
          currency,
          city,
          country,
          'user_submitted' as source,
          createdAt as source_date,
          0.85 as confidence
        FROM UserSalarySubmission 
        WHERE 
          to_tsvector('english', lower(job_title)) @@ to_tsquery('english', $1)
          ${params.company ? `AND company_name ILIKE $2` : ''}
          AND country = $3
          ${params.location ? `AND city ILIKE $4` : ''}
        ORDER BY 
          createdAt DESC
        LIMIT 30
      `;

      const values = [
        params.job_title.toLowerCase().split(' ').join(' & '),
        ...(params.company ? [`%${params.company.toLowerCase()}%`] : []),
        params.country_code,
        ...(params.location ? [`%${params.location.toLowerCase()}%`] : []),
      ];

      const result = await prisma.$queryRawUnsafe(query, ...values);
      return result as any[];
    } catch (error) {
      console.error('Error searching user-submitted data:', error);
      return [];
    }
  }
}

export default new UserSubmittedSource();