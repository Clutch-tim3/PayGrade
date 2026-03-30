import React, { useState } from 'react';
import { JobData } from '../../types/salary.types';

interface SubmitSalaryProps {
  jobData: JobData;
  onSubmit: (data: any) => void;
}

const SubmitSalary: React.FC<SubmitSalaryProps> = ({ jobData, onSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    base_salary: '',
    bonus: '',
    equity: '',
    total_comp: '',
    employment_type: jobData.employmentType || '',
    years_exp: '',
    education_level: '',
    offer_year: new Date().getFullYear(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        job_title: jobData.jobTitle,
        company_name: jobData.company,
        base_salary: parseFloat(formData.base_salary),
        bonus: formData.bonus ? parseFloat(formData.bonus) : null,
        equity: formData.equity ? parseFloat(formData.equity) : null,
        total_comp: parseFloat(formData.total_comp),
        currency: 'USD', // Default to USD
        city: '',
        country: 'US', // Default to US
        employment_type: formData.employment_type,
        years_exp: formData.years_exp ? parseInt(formData.years_exp) : null,
        education_level: formData.education_level,
        offer_year: formData.offer_year,
      });

      setShowForm(false);
      setFormData({
        base_salary: '',
        bonus: '',
        equity: '',
        total_comp: '',
        employment_type: jobData.employmentType || '',
        years_exp: '',
        education_level: '',
        offer_year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error('Salary submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!showForm) {
    return (
      <div className="submit-salary-card">
        <div className="card-header">
          <span className="icon">📊</span>
          <h3>Submit Your Salary</h3>
        </div>
        <div className="card-content">
          <p>Help others by sharing your salary anonymously. Earn 2 Pro credits.</p>
          <button
            className="submit-button"
            onClick={() => setShowForm(true)}
          >
            Submit Salary
          </button>
        </div>

        <style>{`
          .submit-salary-card {
            background: white;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            border: 1px solid #E8E2D9;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .icon {
            font-size: 20px;
          }

          .card-header h3 {
            font-size: 14px;
            font-weight: 600;
            color: #1C1A17;
          }

          .card-content {
            font-size: 13px;
            line-height: 1.5;
            color: #6B6459;
          }

          .card-content p {
            margin-bottom: 12px;
          }

          .submit-button {
            width: 100%;
            padding: 8px 16px;
            background: #15803D;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
          }

          .submit-button:hover {
            background: #16A34A;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="submit-salary-form">
      <div className="form-header">
        <h3>Submit Your Salary</h3>
        <button
          className="close-button"
          onClick={() => setShowForm(false)}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label>Base Salary ($)</label>
          <input
            type="number"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
            required
            placeholder="e.g. 80000"
          />
        </div>

        <div className="form-group">
          <label>Bonus ($)</label>
          <input
            type="number"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            placeholder="e.g. 10000"
          />
        </div>

        <div className="form-group">
          <label>Equity ($)</label>
          <input
            type="number"
            name="equity"
            value={formData.equity}
            onChange={handleChange}
            placeholder="e.g. 5000"
          />
        </div>

        <div className="form-group">
          <label>Total Compensation ($)</label>
          <input
            type="number"
            name="total_comp"
            value={formData.total_comp}
            onChange={handleChange}
            required
            placeholder="e.g. 95000"
          />
        </div>

        <div className="form-group">
          <label>Employment Type</label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="number"
            name="years_exp"
            value={formData.years_exp}
            onChange={handleChange}
            placeholder="e.g. 5"
            min="0"
            max="50"
          />
        </div>

        <div className="form-group">
          <label>Education Level</label>
          <select
            name="education_level"
            value={formData.education_level}
            onChange={handleChange}
          >
            <option value="">Select level</option>
            <option value="high-school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Offer Year</label>
          <select
            name="offer_year"
            value={formData.offer_year}
            onChange={handleChange}
          >
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Salary'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setShowForm(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        .submit-salary-form {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          border: 1px solid #E8E2D9;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .form-header h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1C1A17;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6B6459;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 500;
          color: #6B6459;
        }

        .form-group input,
        .form-group select {
          padding: 8px 12px;
          border: 1px solid #E8E2D9;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          color: #1C1A17;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #15803D;
          box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .submit-button {
          flex: 1;
          padding: 8px 16px;
          background: #15803D;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background: #16A34A;
        }

        .submit-button:disabled {
          background: #D1FAE5;
          cursor: not-allowed;
        }

        .cancel-button {
          flex: 1;
          padding: 8px 16px;
          background: white;
          color: #6B6459;
          border: 1px solid #E8E2D9;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .cancel-button:hover:not(:disabled) {
          background: #F3F4F6;
        }

        .cancel-button:disabled {
          background: #FAFAF9;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SubmitSalary;