import React from 'react';
import { SalaryIntelligence } from '../../types/salary.types';

interface RemoteWorkProps {
  remoteAdjustment: SalaryIntelligence['remote_adjustment'];
  formatCurrency: (amount: number) => string;
}

const RemoteWork: React.FC<RemoteWorkProps> = ({ remoteAdjustment, formatCurrency }) => {
  if (!remoteAdjustment) return null;

  return (
    <div className="remote-work-panel">
      <div className="remote-work-header">
        <span className="remote-work-title">🏠 Remote Work Impact</span>
        <span className="remote-work-subtitle">Salary adjustment for remote roles</span>
      </div>
      <div className="remote-work-content">
        <div className="remote-percentage">
          {remoteAdjustment.remote_pct > 0 ? '+' : ''}{remoteAdjustment.remote_pct}% Adjustment
        </div>
        <div className="remote-range">
          <div className="range-label">Remote Salary Range</div>
          <div className="range-value">
            {formatCurrency(remoteAdjustment.adjusted_range.min)} - {formatCurrency(remoteAdjustment.adjusted_range.max)}
          </div>
          <div className="range-median">
            Median: <strong>{formatCurrency(remoteAdjustment.adjusted_range.median)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteWork;
