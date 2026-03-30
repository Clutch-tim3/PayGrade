import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface TrendsProps {
  trends: SalaryIntelligence['trends'];
}

const Trends: React.FC<TrendsProps> = ({ trends }) => {
  if (!trends) return null;

  const renderTrend = (period: string, value: number) => {
    const isPositive = value > 0;
    const color = isPositive ? '#10b981' : '#ef4444';
    const arrow = isPositive ? '↗' : '↘';
    
    return (
      <div key={period} className="trend-item">
        <div className="trend-period">{period}</div>
        <div className="trend-value" style={{ color }}>
          {arrow} {Math.abs(value)}%
        </div>
      </div>
    );
  };

  return (
    <div className="trends-panel">
      <div className="trends-header">
        <span className="trends-title">📈 Salary Trends</span>
        <span className="trends-subtitle">Year-over-year growth</span>
      </div>
      <div className="trends-content">
        {renderTrend('1 Year', trends.oneYear)}
        {renderTrend('3 Years', trends.threeYear)}
        {renderTrend('5 Years', trends.fiveYear)}
      </div>
    </div>
  );
};

export default Trends;
