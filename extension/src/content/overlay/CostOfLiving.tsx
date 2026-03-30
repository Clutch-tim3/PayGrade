import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface CostOfLivingProps {
  costOfLiving: SalaryIntelligence['cost_of_living'];
}

const CostOfLiving: React.FC<CostOfLivingProps> = ({ costOfLiving }) => {
  if (!costOfLiving) return null;

  const isAboveAverage = costOfLiving.compared_to_national_avg > 0;
  const color = isAboveAverage ? '#ef4444' : '#10b981';

  return (
    <div className="cost-of-living-panel">
      <div className="cost-of-living-header">
        <span className="cost-of-living-title">💰 Cost of Living</span>
        <span className="cost-of-living-subtitle">Comparison to national average</span>
      </div>
      <div className="cost-of-living-content">
        <div className="cost-index">
          <div className="index-label">Cost of Living Index</div>
          <div className="index-value" style={{ color }}>
            {costOfLiving.index}
          </div>
        </div>
        <div className="cost-comparison">
          <div className="comparison-label">
            {isAboveAverage ? 'Above' : 'Below'} National Average
          </div>
          <div className="comparison-value" style={{ color }}>
            {costOfLiving.compared_to_national_avg > 0 ? '+' : ''}{costOfLiving.compared_to_national_avg}%
          </div>
        </div>
        <div className="salary-adjustment">
          <div className="adjustment-label">Recommended Salary Adjustment</div>
          <div className="adjustment-value" style={{ color }}>
            {costOfLiving.salary_adjustment > 0 ? '+' : ''}{costOfLiving.salary_adjustment}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOfLiving;
