export interface JobData {
  jobTitle: string;
  title?: string;
  company: string;
  location: string;
  postedSalary: string | null;
  salary?: number;
  description: string;
  employmentType: string | null;
  seniorityLevel: string | null;
  remote: boolean;
  url: string;
}

export interface SalaryIntelligence {
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
  min?: number;
  max?: number;
  median?: number;
  confidence: 'high' | 'medium' | 'low' | number;
  data_points: number;
  sourceCount?: number;
  sources: Array<{ source: string; count: number } | { name: string; count: number }>;
  posted_salary_assessment?: {
    posted: number;
    vs_market: 'below' | 'fair' | 'above';
    pct_diff: number;
    label: string;
  };
  negotiation_insight?: string;
  negotiationInsight?: string;
  company_data?: any;
  similar_roles?: Array<{ title: string; company: string; range: string }>;
  similarRoles?: Array<{ role: string; company: string; range: string }>;
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

export interface User {
  id: string;
  email: string;
  tier: 'free' | 'pro';
  lookups_this_month: number;
  lookups_limit: number;
  credits_earned: number;
}

export interface SalarySubmission {
  job_title: string;
  company_name?: string;
  total_comp: number;
  base_salary: number;
  bonus?: number;
  equity?: number;
  currency: string;
  city: string;
  country: string;
  years_exp?: number;
  education_level?: string;
  employment_type: string;
  offer_year: number;
}
