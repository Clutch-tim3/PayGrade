import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface SalaryCardProps {
  salaryData: SalaryIntelligence;
  postedSalary?: number;
}

const SalaryCard: React.FC<SalaryCardProps> = ({ salaryData, postedSalary = 0 }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatShortCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `R${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `R${(amount / 1000).toFixed(0)}K`;
    }
    return formatCurrency(amount);
  };

  const getConfidenceDots = (confidence: number | string): React.ReactNode => {
    let level = 0;
    if (typeof confidence === 'string') {
      level = confidence === 'high' ? 4 : confidence === 'medium' ? 3 : 1;
    } else {
      level = Math.round(confidence * 5);
    }
    
    const dots = [];
    for (let i = 0; i < 5; i++) {
      dots.push(
        <div key={i} className={`conf-dot ${i >= level ? 'empty' : ''}`}></div>
      );
    }
    return dots;
  };

  const getConfidenceText = (confidence: number | string, dataPoints: number): string => {
    if (typeof confidence === 'string') {
      const prefix = confidence === 'high' ? 'Strong' : confidence === 'medium' ? 'Medium' : 'Weak';
      return `${prefix} data · ${dataPoints} points`;
    }
    
    const prefix = confidence >= 0.7 ? 'Strong' : confidence >= 0.5 ? 'Medium' : 'Weak';
    return `${prefix} data · ${dataPoints} points`;
  };

  // Get salary range from salaryData
  const min = salaryData.min || salaryData.range?.min || 0;
  const max = salaryData.max || salaryData.range?.max || 0;
  const median = salaryData.median || salaryData.range?.median || 0;
  const dataPoints = salaryData.sourceCount || salaryData.data_points || 0;

  // Calculate bar positions
  const medianPercent = ((median - min) / (max - min)) * 100;
  const postedPercent = postedSalary > 0 ? ((postedSalary - min) / (max - min)) * 100 : -1;

  return (
    <div className="salary-card">
      <div className="salary-card-label">Market Rate · ZAR · Annual</div>
      <div className="salary-range-numbers">
        {formatCurrency(min)} — {formatCurrency(max)}
      </div>
      <div className="salary-median-row">
        <span className="salary-median-label">▲ Median</span>
        <span className="salary-median-value">{formatCurrency(median)}</span>
      </div>

      <div className="range-bar">
        <div className="range-bar-fill" style={{ left: '0', right: '0' }}></div>
        <div 
          className="range-bar-marker median" 
          style={{ left: `${medianPercent}%` }}
        ></div>
        {postedPercent >= 0 && postedPercent <= 100 && (
          <div 
            className="range-bar-marker posted" 
            style={{ left: `${postedPercent}%` }}
          ></div>
        )}
      </div>

      <div className="range-labels">
        <span>{formatShortCurrency(min)}</span>
        <span>{formatShortCurrency(median)} med</span>
        <span>{formatShortCurrency(max)}</span>
      </div>

      <div className="confidence-dots">
        {getConfidenceDots(salaryData.confidence)}
        <span className="conf-text">
          {getConfidenceText(salaryData.confidence, dataPoints)}
        </span>
      </div>
    </div>
  );
};

export default SalaryCard;
