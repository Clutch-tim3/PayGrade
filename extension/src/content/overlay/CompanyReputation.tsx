import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface CompanyReputationProps {
  reputation: SalaryIntelligence['company_reputation'];
}

const CompanyReputation: React.FC<CompanyReputationProps> = ({ reputation }) => {
  if (!reputation) return null;

  const getFairnessColor = (fairness: string): string => {
    switch (fairness) {
      case 'above':
        return '#10b981';
      case 'fair':
        return '#f59e0b';
      case 'below':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getFairnessText = (fairness: string): string => {
    switch (fairness) {
      case 'above':
        return 'Pays above market';
      case 'fair':
        return 'Pays fair market rate';
      case 'below':
        return 'Pays below market';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="company-reputation-panel">
      <div className="company-reputation-header">
        <span className="company-reputation-title">🏢 Company Reputation</span>
        <span className="company-reputation-subtitle">Salary and benefits insights</span>
      </div>
      <div className="company-reputation-content">
        <div className="reputation-score">
          <div className="score-label">Overall Score</div>
          <div className="score-value">{reputation.score}/100</div>
        </div>
        <div className="salary-fairness">
          <div className="fairness-label">Salary Fairness</div>
          <div 
            className="fairness-value" 
            style={{ color: getFairnessColor(reputation.salary_fairness) }}
          >
            {getFairnessText(reputation.salary_fairness)}
          </div>
        </div>
        <div className="benefits-rating">
          <div className="benefits-label">Benefits Rating</div>
          <div className="benefits-value">
            {'⭐'.repeat(reputation.benefits_rating)}{'☆'.repeat(5 - reputation.benefits_rating)}
          </div>
        </div>
        <div className="review-count">
          <div className="review-label">Based on</div>
          <div className="review-value">{reputation.review_count} reviews</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyReputation;
