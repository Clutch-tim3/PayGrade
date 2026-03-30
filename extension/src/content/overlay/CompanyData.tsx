import React from 'react';

interface CompanyDataProps {
  data: any;
}

const CompanyData: React.FC<CompanyDataProps> = ({ data }) => {
  return (
    <div className="company-data">
      <div className="panel-header">
        <span className="panel-icon">🏢</span>
        <h3>Company Salary Data</h3>
      </div>

      <div className="panel-content">
        <div className="company-summary">
          <p>Based on {data.total} data points</p>
          <p>
            Average range: <strong>{data.average_min.toLocaleString()} - {data.average_max.toLocaleString()}</strong>
          </p>
        </div>

        {data.positions && data.positions.length > 0 && (
          <div className="positions">
            <h4>Similar positions at this company:</h4>
            <div className="position-list">
              {data.positions.map((position: any, index: number) => (
                <div key={index} className="position-item">
                  <div className="position-title">{position.title}</div>
                  <div className="position-range">{position.range}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .company-data {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          border: 1px solid #E8E2D9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .panel-icon {
          font-size: 20px;
        }

        .panel-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1C1A17;
        }

        .panel-content {
          font-size: 13px;
          line-height: 1.5;
          color: #1C1A17;
        }

        .company-summary {
          margin-bottom: 12px;
        }

        .company-summary p {
          margin-bottom: 4px;
        }

        .company-summary strong {
          font-weight: 600;
          color: #15803D;
        }

        .positions h4 {
          font-size: 12px;
          font-weight: 600;
          color: #6B6459;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .position-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .position-item {
          padding: 8px;
          background: #FAFAF9;
          border-radius: 4px;
          border-left: 2px solid #15803D;
        }

        .position-title {
          font-weight: 500;
          margin-bottom: 2px;
        }

        .position-range {
          font-size: 12px;
          color: #6B6459;
        }
      `}</style>
    </div>
  );
};

export default CompanyData;