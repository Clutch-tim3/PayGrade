import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface JobKeywordsProps {
  keywords: SalaryIntelligence['job_keywords'];
}

const JobKeywords: React.FC<JobKeywordsProps> = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'technical':
        return '💻';
      case 'soft':
        return '👥';
      case 'certification':
        return '📜';
      default:
        return '🏷️';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'technical':
        return '#6366f1';
      case 'soft':
        return '#10b981';
      case 'certification':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="job-keywords-panel">
      <div className="job-keywords-header">
        <span className="job-keywords-title">🔑 Job Description Keywords</span>
        <span className="job-keywords-subtitle">Impact on salary</span>
      </div>
      <div className="job-keywords-content">
        {keywords.map((keyword, index) => (
          <div key={index} className="keyword-item">
            <div className="keyword-info">
              <span className="keyword-icon">{getCategoryIcon(keyword.category)}</span>
              <span className="keyword-text">{keyword.keyword}</span>
              <span 
                className="keyword-category" 
                style={{ backgroundColor: getCategoryColor(keyword.category) }}
              >
                {keyword.category}
              </span>
            </div>
            <div className="keyword-impact">
              +{keyword.salary_impact}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobKeywords;
