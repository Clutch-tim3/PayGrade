import React, { useState } from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface BreakdownProps {
  experienceBreakdown: SalaryIntelligence['experience_breakdown'];
  educationBreakdown: SalaryIntelligence['education_breakdown'];
  formatCurrency: (amount: number) => string;
}

const Breakdown: React.FC<BreakdownProps> = ({ 
  experienceBreakdown, 
  educationBreakdown, 
  formatCurrency 
}) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const renderExperience = () => {
    if (!experienceBreakdown) return null;

    return (
      <div className="breakdown-content">
        {experienceBreakdown.map((level, index) => (
          <div key={index} className="breakdown-item">
            <div className="breakdown-level">
              <span className="level-name">{level.level}</span>
              <span className="level-count">{level.count} data points</span>
            </div>
            <div className="breakdown-range">
              <div className="range-value">
                {formatCurrency(level.min)} - {formatCurrency(level.max)}
              </div>
              <div className="range-median">
                Median: {formatCurrency(level.median)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!educationBreakdown) return null;

    return (
      <div className="breakdown-content">
        {educationBreakdown.map((level, index) => (
          <div key={index} className="breakdown-item">
            <div className="breakdown-level">
              <span className="level-name">{level.level}</span>
              <span className="level-count">{level.count} data points</span>
            </div>
            <div className="breakdown-range">
              <div className="range-value">
                {formatCurrency(level.min)} - {formatCurrency(level.max)}
              </div>
              <div className="range-median">
                Median: {formatCurrency(level.median)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="breakdown-panel">
      <div className="breakdown-header">
        <span className="breakdown-title">📊 Salary Breakdown</span>
        <div className="breakdown-tabs">
          <button
            className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience Level
          </button>
          <button
            className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education Level
          </button>
        </div>
      </div>
      <div className="breakdown-body">
        {activeTab === 'experience' ? renderExperience() : renderEducation()}
      </div>
    </div>
  );
};

export default Breakdown;
