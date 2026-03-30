import React, { useState, useEffect } from 'react';
import { JobData, SalaryIntelligence } from '../../types/salary.types';
import SalaryCard from './SalaryCard';
import NegotiationPanel from './NegotiationPanel';
import SimilarRoles from './SimilarRoles';
import Trends from './Trends';
import RemoteWork from './RemoteWork';
import CostOfLiving from './CostOfLiving';
import Breakdown from './Breakdown';
import Skills from './Skills';
import CompanyReputation from './CompanyReputation';
import JobKeywords from './JobKeywords';
import api from '../../lib/api';

interface OverlayProps {
  jobData: JobData;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ jobData, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState<SalaryIntelligence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [parseFailed, setParseFailed] = useState(false);
  const [rateLimit, setRateLimit] = useState(false);
  const [noData, setNoData] = useState(false);
  const [showSalaryHiding, setShowSalaryHiding] = useState(false);

  useEffect(() => {
    fetchSalaryData();
  }, [jobData]);

  const fetchSalaryData = async () => {
    setLoading(true);
    setError(null);
    setParseFailed(false);
    setRateLimit(false);
    setNoData(false);
    setShowSalaryHiding(false);

    try {
      // Simulate API call with demo data for testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly select different states
      const randomState = Math.random();
      
      if (randomState < 0.1) {
        setRateLimit(true);
      } else if (randomState < 0.2) {
        setNoData(true);
      } else if (randomState < 0.3) {
        setParseFailed(true);
      } else if (randomState < 0.4) {
        setError('Network error');
      } else if (randomState < 0.5) {
        setShowSalaryHiding(true);
        // Still set salary data for this case
        setSalaryData({
          role_detected: 'Senior Software Engineer',
          location: 'Johannesburg',
          currency: 'ZAR',
          range: {
            min: 620000,
            p25: 680000,
            median: 780000,
            p75: 860000,
            max: 950000
          },
          min: 620000,
          max: 950000,
          median: 780000,
          confidence: 0.6,
          data_points: 28,
          sourceCount: 28,
          sources: [
            { source: 'H1B', count: 16 },
            { source: 'Glassdoor', count: 8 },
            { source: 'Community', count: 4 }
          ],
          negotiation_insight: "Companies that hide salary often pay below market median. Lead with your number: 'I'm targeting R 800,000–R 850,000 based on market data.' Don't ask what they pay.",
          similar_roles: [
            { title: 'Software Engineer', company: 'Naspers', range: 'R580–820K' },
            { title: 'Senior Developer', company: 'MTN', range: 'R650–900K' },
            { title: 'Tech Lead', company: 'Discovery', range: 'R750–1.1M' }
          ]
        });
      } else {
        // Default case: show full salary data
         setSalaryData({
          role_detected: 'Senior Product Manager',
          location: 'Cape Town',
          currency: 'ZAR',
          range: {
            min: 450000,
            p25: 500000,
            median: 565000,
            p75: 650000,
            max: 720000
          },
          min: 450000,
          max: 720000,
          median: 565000,
          confidence: 0.85,
          data_points: 47,
          sourceCount: 47,
          sources: [
            { source: 'H1B', count: 23 },
            { source: 'Glassdoor', count: 12 },
            { source: 'Community', count: 8 },
            { source: 'Reddit', count: 4 }
          ],
          negotiation_insight: "Takealot typically opens 10–18% below their ceiling. Counter at R 620,000–R 640,000 to land at R 580,000+. Lead with market data, not personal need.",
          similar_roles: [
            { title: 'Product Lead', company: 'Yoco', range: 'R520–680K' },
            { title: 'Senior PM', company: 'Standard Bank', range: 'R480–640K' },
            { title: 'Head of Product', company: 'OfferZen', range: 'R600–820K' }
          ],
          trends: {
            oneYear: 8,
            threeYear: 22,
            fiveYear: 35
          },
          remote_adjustment: {
            remote_pct: -10,
            adjusted_range: {
              min: 405000,
              median: 508500,
              max: 648000
            }
          },
          cost_of_living: {
            index: 115,
            compared_to_national_avg: 15,
            salary_adjustment: 15
          },
          experience_breakdown: [
            { level: 'Entry', min: 350000, median: 420000, max: 480000, count: 8 },
            { level: 'Mid', min: 480000, median: 560000, max: 640000, count: 15 },
            { level: 'Senior', min: 600000, median: 720000, max: 850000, count: 12 },
            { level: 'Lead', min: 780000, median: 880000, max: 1050000, count: 8 },
            { level: 'Principal', min: 950000, median: 1100000, max: 1300000, count: 4 }
          ],
          education_breakdown: [
            { level: 'High School', min: 280000, median: 350000, max: 420000, count: 3 },
            { level: 'Bachelor\'s', min: 420000, median: 550000, max: 680000, count: 25 },
            { level: 'Master\'s', min: 580000, median: 720000, max: 880000, count: 14 },
            { level: 'PhD', min: 750000, median: 900000, max: 1100000, count: 5 }
          ],
          skill_adjustments: [
            { skill: 'React', adjustment: 8, level: 'intermediate' },
            { skill: 'Node.js', adjustment: 12, level: 'advanced' },
            { skill: 'AWS', adjustment: 15, level: 'advanced' },
            { skill: 'Data Science', adjustment: 18, level: 'expert' },
            { skill: 'Leadership', adjustment: 10, level: 'advanced' }
          ],
          company_reputation: {
            score: 78,
            salary_fairness: 'fair',
            review_count: 145,
            benefits_rating: 4
          },
          job_keywords: [
            { keyword: 'React', salary_impact: 8, category: 'technical' },
            { keyword: 'Leadership', salary_impact: 10, category: 'soft' },
            { keyword: 'AWS', salary_impact: 12, category: 'certification' }
          ]
        });
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const exportPDF = async () => {
    try {
      const pdfBlob = await api.generatePDF(salaryData);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paygrade-report-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const getConfidenceClass = (confidence: number | string): 'high' | 'medium' | 'low' => {
    if (typeof confidence === 'string') {
      return confidence as 'high' | 'medium' | 'low';
    }
    if (confidence >= 0.7) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  };

  const getConfidenceText = (confidence: number | string): string => {
    if (typeof confidence === 'string') {
      return confidence === 'high' ? 'High' : confidence === 'medium' ? 'Med' : 'Low';
    }
    if (confidence >= 0.7) return 'High';
    if (confidence >= 0.5) return 'Med';
    return 'Low';
  };

  const renderLoading = () => (
    <div className="overlay active">
      <div className="ov-header">
        <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
        <div className="ov-header-right">
          <button className="ov-icon-btn" title="Close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="ov-loading">
        <div className="ov-spinner"></div>
        <div className="ov-loading-text">Looking up salary data…</div>
      </div>
    </div>
  );

  const renderFullData = () => {
    if (!salaryData) return null;
    const hasPostedSalary = jobData.postedSalary && parseFloat(jobData.postedSalary) > 0;
    const postedSalary = hasPostedSalary ? parseFloat(jobData.postedSalary as string) : 0;
    const median = salaryData.median || salaryData.range?.median || 0;
    let comparisonClass = 'fair';
    let comparisonText = 'Fair';
    
    if (hasPostedSalary && median > 0) {
      const percentage = ((postedSalary - median) / median) * 100;
      if (percentage < -10) {
        comparisonClass = 'below';
        comparisonText = `⚠ ${Math.abs(Math.round(percentage))}% below market`;
      } else if (percentage > 10) {
        comparisonClass = 'above';
        comparisonText = `✓ ${Math.round(percentage)}% above market`;
      }
    }

    return (
      <div className="overlay active">
        <div className="ov-header">
          <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
          <div className="ov-header-right">
            <button className="ov-icon-btn" title="Settings">⚙</button>
            <button className="ov-icon-btn" title="Close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="ov-role-row">
          <div className="ov-role-text">
            <strong>{jobData.title || 'Senior Product Manager'}</strong> · {jobData.location || 'Cape Town'} · {jobData.company || 'Takealot'}
          </div>
          <div className={`confidence-badge ${getConfidenceClass(salaryData.confidence)}`}>
            ● {getConfidenceText(salaryData.confidence)}
          </div>
        </div>

         <div className="ov-body">
          <SalaryCard salaryData={salaryData} postedSalary={postedSalary} />
          
          {hasPostedSalary && (
            <div className={`posted-comparison ${comparisonClass}`}>
              <div className="posted-label">
                Listed: <strong>{formatCurrency(postedSalary)}</strong>
              </div>
              <div className={`posted-badge ${comparisonClass}`}>{comparisonText}</div>
            </div>
          )}

          <div className="sources-row">
            <span>Sources:</span>
            <div className="source-chips">
              {salaryData.sources.map((source, index) => {
                const src = source as any;
                return (
                  <span key={index} className="source-chip">
                    {src.name || src.source} ({src.count})
                  </span>
                );
              })}
            </div>
          </div>

          {salaryData.trends && <Trends trends={salaryData.trends} />}
          
          {salaryData.remote_adjustment && (
            <RemoteWork 
              remoteAdjustment={salaryData.remote_adjustment} 
              formatCurrency={formatCurrency} 
            />
          )}
          
          {salaryData.cost_of_living && (
            <CostOfLiving costOfLiving={salaryData.cost_of_living} />
          )}
          
          {(salaryData.experience_breakdown || salaryData.education_breakdown) && (
            <Breakdown 
              experienceBreakdown={salaryData.experience_breakdown} 
              educationBreakdown={salaryData.education_breakdown}
              formatCurrency={formatCurrency}
            />
          )}
          
          {salaryData.skill_adjustments && (
            <Skills skills={salaryData.skill_adjustments} />
          )}
          
          {salaryData.company_reputation && (
            <CompanyReputation reputation={salaryData.company_reputation} />
          )}
          
          {salaryData.job_keywords && (
            <JobKeywords keywords={salaryData.job_keywords} />
          )}

          {salaryData.negotiationInsight && (
            <NegotiationPanel insight={salaryData.negotiationInsight} />
          )}

          {salaryData.similarRoles && (
            <SimilarRoles roles={salaryData.similarRoles} />
          )}

          <div className="ov-actions">
            <button className="ov-action-btn" onClick={() => navigator.clipboard.writeText(`${formatCurrency(salaryData.range.min)} - ${formatCurrency(salaryData.range.max)}`)}>
              📋 Copy range
            </button>
            <button className="ov-action-btn">🔔 Set alert</button>
            <button className="ov-action-btn">↗ More data</button>
            <button className="ov-action-btn" onClick={() => exportPDF()}>
              📄 Export PDF
            </button>
          </div>
        </div>

        <div className="ov-footer">
          <div className="ov-footer-left">
            Free · 7/10 used · <a>Submit salary</a>
          </div>
          <button className="ov-upgrade-btn">Go Pro</button>
        </div>
      </div>
    );
  };

  const renderSalaryHiding = () => {
    if (!salaryData) return null;
    
    return (
      <div className="overlay active">
        <div className="ov-header">
          <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
          <div className="ov-header-right">
            <button className="ov-icon-btn">⚙</button>
            <button className="ov-icon-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="ov-role-row">
          <div className="ov-role-text">
            <strong>{jobData.title || 'Senior Software Engineer'}</strong> · {jobData.location || 'Johannesburg'} · {jobData.company || 'Sasol'}
          </div>
          <div className={`confidence-badge ${getConfidenceClass(salaryData.confidence)}`}>
            ● {getConfidenceText(salaryData.confidence)}
          </div>
        </div>

        <div className="salary-hiding-banner">
          <span>👀</span>
          <span>This listing says <strong>"Market Related"</strong> instead of a number. Here's what the market actually pays:</span>
        </div>

        <div className="ov-body">
          <SalaryCard salaryData={salaryData} postedSalary={0} />
          
          {salaryData.negotiationInsight && (
            <NegotiationPanel insight={salaryData.negotiationInsight} />
          )}

          <div className="ov-actions">
            <button className="ov-action-btn">📋 Copy range</button>
            <button className="ov-action-btn">↗ More data</button>
          </div>
        </div>

        <div className="ov-footer">
          <div className="ov-footer-left">Free · 5/10 · <a>Submit salary</a></div>
          <button className="ov-upgrade-btn">Go Pro</button>
        </div>
      </div>
    );
  };

  const renderNoData = () => (
    <div className="overlay active">
      <div className="ov-header">
        <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
        <div className="ov-header-right">
          <button className="ov-icon-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="ov-role-row">
        <div className="ov-role-text">
          <strong>{jobData.title || 'UX Researcher'}</strong> · {jobData.location || 'Durban'} · {jobData.company || 'BCX'}
        </div>
        <div className="confidence-badge low">● Low</div>
      </div>
      <div className="ov-error">
        <div className="ov-error-icon">📊</div>
        <div className="ov-error-heading">No data yet for this role</div>
        <div className="ov-error-body">Help us build it — submit your salary data and we'll notify you when more data arrives for this role in Durban.</div>
        <div className="ov-error-btns">
          <button className="ov-err-btn-primary">Submit my salary →</button>
          <button className="ov-err-btn-sec">🔔 Alert me when data arrives</button>
        </div>
      </div>
      <div className="ov-footer">
        <div className="ov-footer-left">Free · 3/10 used</div>
        <button className="ov-upgrade-btn">Go Pro</button>
      </div>
    </div>
  );

  const renderRateLimit = () => (
    <div className="overlay active">
      <div className="ov-header">
        <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
        <div className="ov-header-right">
          <button className="ov-icon-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="ov-error" style={{paddingTop: '28px'}}>
        <div className="ov-error-icon">🔒</div>
        <div className="ov-error-heading">Monthly limit reached</div>
        <div className="ov-error-body">You've used all 10 free lookups this month. Resets April 1st. Upgrade for unlimited lookups and full negotiation intelligence.</div>
        <div style={{width: '100%', background: '#f4f0eb', borderRadius: '6px', height: '5px', overflow: 'hidden', margin: '4px 0'}}>
          <div style={{width: '100%', height: '100%', background: '#dc2626', borderRadius: '6px'}}></div>
        </div>
        <div style={{fontSize: '10.5px', color: 'var(--ink-3)', fontFamily: 'var(--mono)'}}>10 / 10 used · Resets Apr 1</div>
        <div className="ov-error-btns">
          <button className="ov-err-btn-primary">Upgrade to Pro — $12/mo</button>
          <button className="ov-err-btn-sec">Remind me next month</button>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="overlay active">
      <div className="ov-header">
        <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
        <div className="ov-header-right">
          <button className="ov-icon-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="ov-error" style={{paddingTop: '28px'}}>
        <div className="ov-error-icon">📡</div>
        <div className="ov-error-heading">Couldn't reach PayGrade</div>
        <div className="ov-error-body">Salary data unavailable — check your internet connection and try again.</div>
        <div className="ov-error-btns">
          <button className="ov-err-btn-primary" onClick={fetchSalaryData}>Retry</button>
        </div>
      </div>
    </div>
  );

  const renderParseFailed = () => (
    <div className="overlay active">
      <div className="ov-header">
        <div className="ov-logo"><div className="ov-logo-mark">PG</div> PayGrade</div>
        <div className="ov-header-right">
          <button className="ov-icon-btn" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="ov-error" style={{paddingTop: '24px'}}>
        <div className="ov-error-icon">🤔</div>
        <div className="ov-error-heading">Couldn't read this listing</div>
        <div className="ov-error-body">PayGrade couldn't extract the job details automatically. Try entering them manually:</div>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px'}}>
          <input type="text" placeholder="Job title" style={{width: '100%', height: '36px', background: 'var(--stone)', border: '1px solid var(--border-2)', borderRadius: '7px', padding: '0 12px', fontFamily: 'var(--sans)', fontSize: '12.5px', color: 'var(--ink)'}} />
          <input type="text" placeholder="City / Location" style={{width: '100%', height: '36px', background: 'var(--stone)', border: '1px solid var(--border-2)', borderRadius: '7px', padding: '0 12px', fontFamily: 'var(--sans)', fontSize: '12.5px', color: 'var(--ink)'}} />
          <button className="ov-err-btn-primary" style={{marginTop: '2px'}}>Look up →</button>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (rateLimit) return renderRateLimit();
  if (noData) return renderNoData();
  if (parseFailed) return renderParseFailed();
  if (error) return renderError();
  if (showSalaryHiding) return renderSalaryHiding();
  return renderFullData();
};

export default Overlay;
