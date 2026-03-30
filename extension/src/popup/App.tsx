import React, { useState, useEffect } from 'react';
import auth from '../lib/auth';
import api from '../lib/api';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<'logged-out' | 'logging-in' | 'logged-in'>('logged-out');
  const [email, setEmail] = useState('');
  const [billingStatus, setBillingStatus] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'main' | 'signin' | 'settings'>('onboarding');
  const [settings, setSettings] = useState({
    autoShow: true,
    position: 'side' as 'side' | 'inline'
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await auth.isAuthenticated();
      if (authenticated) {
        setUser(auth.getUser());
        setAuthState('logged-in');
        const billing = await auth.getBillingStatus();
        setBillingStatus(billing);
      } else {
        setAuthState('logged-out');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState('logged-out');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthState('logging-in');
    try {
      await auth.login(email);
      alert('Check your email for the login link');
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to send login email. Please try again.');
    } finally {
      setAuthState('logged-out');
    }
  };

  const toggleSwitch = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = e.currentTarget;
    const toggle = row.querySelector('.toggle-switch');
    if (toggle) {
      toggle.classList.toggle('on');
      if (row.textContent?.includes('Auto-show')) {
        setSettings(prev => ({ ...prev, autoShow: !prev.autoShow }));
      } else if (row.textContent?.includes('Show free tier')) {
        // Handle free tier counter toggle
      }
    }
  };

  const setPosition = (pos: 'side' | 'inline') => {
    setSettings(prev => ({ ...prev, position: pos }));
  };

  const renderOnboarding = () => (
    <div className="pp-screen active">
      <div className="pp-header">
        <div className="pp-logo"><div className="pp-logo-mark">PG</div> PayGrade</div>
      </div>
      <div className="pp-onboarding">
        <div className="pp-onboard-logo">PG</div>
        <div className="pp-onboard-title">PayGrade is ready.</div>
        <div className="pp-onboard-sub">Open any job listing and PayGrade automatically shows you what the role actually pays — before you apply.</div>

        <div className="sites-grid">
          <div className="site-chip"><span className="site-icon">💼</span>LinkedIn</div>
          <div className="site-chip"><span className="site-icon">🔍</span>Indeed</div>
          <div className="site-chip"><span className="site-icon">🚪</span>Glassdoor</div>
          <div className="site-chip"><span className="site-icon">🌿</span>Seek</div>
          <div className="site-chip"><span className="site-icon">🇿🇦</span>Careers24</div>
          <div className="site-chip"><span className="site-icon">➕</span>+10 more</div>
        </div>

        <button className="pp-btn-primary" onClick={() => setCurrentScreen('signin')}>Sign in to unlock full features →</button>
        <button className="pp-btn-secondary" onClick={() => setCurrentScreen('main')}>Skip — use 10 free lookups/month</button>
        <div style={{fontSize: '11px', color: 'var(--pp-text3)', textAlign: 'center', marginTop: '2px'}}>No credit card required</div>
      </div>
    </div>
  );

  const renderMain = () => (
    <div className="pp-screen active">
      <div className="pp-header">
        <div className="pp-logo"><div className="pp-logo-mark">PG</div> PayGrade</div>
        <div style={{display: 'flex', gap: '6px'}}>
          <button className="pp-icon-btn" onClick={() => setCurrentScreen('settings')} title="Settings">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="pp-account-row">
        <span className="pp-email">thabang@prodigy.co.za</span>
        <span className="pp-plan-badge free">Free</span>
      </div>

      <div className="pp-section">
        <div className="pp-section-label">This month's lookups</div>
        <div className="usage-meter-bar">
          <div className="usage-meter-fill" style={{width: '70%'}}></div>
        </div>
        <div className="usage-meta">
          <span>7 / 10 used</span>
          <span>Resets Apr 1</span>
        </div>
        <div className="pp-upgrade-strip">
          <div className="pp-upgrade-text"><strong>3 lookups left.</strong> Pro is unlimited.</div>
          <button className="pp-upgrade-btn">Upgrade — $12</button>
        </div>
      </div>

      <div className="pp-section" style={{borderBottom: 'none', flex: 1}}>
        <div className="pp-section-label">Recent lookups</div>
        <div className="pp-lookup-row">
          <div className="pp-lookup-info">
            <div className="pp-lookup-title">Senior Product Manager</div>
            <div className="pp-lookup-company">Takealot · Cape Town</div>
          </div>
          <div className="pp-lookup-right">
            <div className="pp-lookup-range">R450–720K</div>
            <div className="pp-lookup-time">2 hrs ago</div>
          </div>
        </div>
        <div className="pp-lookup-row">
          <div className="pp-lookup-info">
            <div className="pp-lookup-title">Software Engineer</div>
            <div className="pp-lookup-company">FNB · Johannesburg</div>
          </div>
          <div className="pp-lookup-right">
            <div className="pp-lookup-range">R380–520K</div>
            <div className="pp-lookup-time">Yesterday</div>
          </div>
        </div>
        <div className="pp-lookup-row">
          <div className="pp-lookup-info">
            <div className="pp-lookup-title">UX Designer</div>
            <div className="pp-lookup-company">Discovery · Johannesburg</div>
          </div>
          <div className="pp-lookup-right">
            <div className="pp-lookup-range">R320–460K</div>
            <div className="pp-lookup-time">2 days ago</div>
          </div>
        </div>
        <div className="pp-lookup-row">
          <div className="pp-lookup-info">
            <div className="pp-lookup-title">Data Analyst</div>
            <div className="pp-lookup-company">Standard Bank · Remote</div>
          </div>
          <div className="pp-lookup-right">
            <div className="pp-lookup-range">R280–420K</div>
            <div className="pp-lookup-time">3 days ago</div>
          </div>
        </div>

        <div style={{marginTop: '12px'}}>
          <div className="pp-section-label" style={{marginBottom: '6px'}}>Pro credits</div>
          <div className="credits-row">
            <div className="credits-bar"><div className="credits-fill" style={{width: '40%'}}></div></div>
            <span className="credits-label">4 / 10</span>
          </div>
          <div style={{fontSize: '11px', color: 'var(--pp-text3)'}}>Submit 3 more salaries to unlock 1 month Pro</div>
        </div>
      </div>
    </div>
  );

  const renderSignIn = () => (
    <div className="pp-screen active">
      <div className="pp-header">
        <div className="pp-logo"><div className="pp-logo-mark">PG</div> PayGrade</div>
        <button className="pp-icon-btn" onClick={() => setCurrentScreen('main')}>←</button>
      </div>
      <div className="pp-sign-in">
        <div className="pp-sign-in-title">Sign in to save your lookups</div>
        <div style={{fontSize: '12.5px', color: 'var(--pp-text2)', textAlign: 'center', marginBottom: '8px'}}>Magic link — no password required</div>
        <input className="pp-input" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="pp-btn-primary" onClick={handleLogin}>Send magic link →</button>
        <div style={{height: '1px', background: 'var(--pp-bdr)', width: '100%', margin: '4px 0'}}></div>
        <button className="pp-btn-secondary" onClick={() => setCurrentScreen('main')}>Continue anonymously — 10 free/month</button>
        <div style={{fontSize: '11px', color: 'var(--pp-text3)', textAlign: 'center', marginTop: '8px'}}>No personal data stored. We use your email only to authenticate.</div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pp-screen active">
      <div className="pp-header">
        <div className="pp-logo">Settings</div>
        <button className="pp-icon-btn" onClick={() => setCurrentScreen('main')}>← Back</button>
      </div>
      <div className="pp-body" style={{padding: '0 16px'}}>
        <div style={{borderBottom: '1px solid var(--pp-bdr)', padding: '12px 0 8px'}}>
          <div style={{fontSize: '10px', color: 'var(--pp-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'}}>Account</div>
          <div className="pp-setting-row" style={{cursor: 'default'}}>
            <span className="pp-setting-label">Email</span>
            <span style={{fontSize: '11.5px', color: 'var(--pp-text2)'}}>thabang@prodigy.co.za</span>
          </div>
          <div className="pp-setting-row" style={{cursor: 'default'}}>
            <span className="pp-setting-label">Plan</span>
            <span className="pp-plan-badge free">Free</span>
          </div>
        </div>
        <div style={{borderBottom: '1px solid var(--pp-bdr)', padding: '12px 0 8px'}}>
          <div style={{fontSize: '10px', color: 'var(--pp-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px'}}>Overlay</div>
          <div className="pp-setting-row" onClick={toggleSwitch}>
            <span className="pp-setting-label">Auto-show on job listings</span>
            <div className={`toggle-switch ${settings.autoShow ? 'on' : ''}`}></div>
          </div>
          <div className="pp-setting-row" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '8px'}}>
            <span className="pp-setting-label">Position</span>
            <div style={{display: 'flex', gap: '6px', width: '100%'}}>
              <button 
                style={{
                  flex: 1,
                  height: '32px',
                  background: settings.position === 'side' ? 'var(--pp-surf2)' : 'var(--pp-surf)',
                  borderColor: settings.position === 'side' ? 'var(--pp-bdr2)' : 'var(--pp-bdr)',
                  color: settings.position === 'side' ? 'var(--pp-text)' : 'var(--pp-text2)',
                  borderRadius: '6px',
                  fontFamily: 'var(--sans)',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.12s'
                }}
                onClick={() => setPosition('side')}
              >
                Side panel
              </button>
              <button 
                style={{
                  flex: 1,
                  height: '32px',
                  background: settings.position === 'inline' ? 'var(--pp-surf2)' : 'var(--pp-surf)',
                  borderColor: settings.position === 'inline' ? 'var(--pp-bdr2)' : 'var(--pp-bdr)',
                  color: settings.position === 'inline' ? 'var(--pp-text)' : 'var(--pp-text2)',
                  borderRadius: '6px',
                  fontFamily: 'var(--sans)',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'all 0.12s'
                }}
                onClick={() => setPosition('inline')}
              >
                Inline
              </button>
            </div>
          </div>
        </div>
        <div style={{padding: '12px 0 8px'}}>
          <div className="pp-setting-row" onClick={toggleSwitch}>
            <span className="pp-setting-label">Show free tier counter</span>
            <div className="toggle-switch on"></div>
          </div>
          <div className="pp-setting-row" onClick={() => alert('Cache cleared')}>
            <span className="pp-setting-label" style={{color: 'var(--pp-text2)'}}>Clear cached salary data</span>
            <span style={{fontSize: '11px', color: 'var(--pp-text3)'}}>→</span>
          </div>
        </div>
        <div style={{padding: '8px 0 16px', display: 'flex', flexDirection: 'column', gap: '7px'}}>
          <button className="pp-btn-primary" onClick={() => setCurrentScreen('main')}>Upgrade to Pro — $12/mo</button>
          <button className="pp-btn-secondary" onClick={() => setCurrentScreen('signin')}>Sign out</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="pp-screen active">
        <div className="pp-header">
          <div className="pp-logo"><div className="pp-logo-mark">PG</div> PayGrade</div>
        </div>
        <div className="pp-loading">
          <div className="pp-spinner"></div>
          <div className="pp-loading-text">Loading…</div>
        </div>
      </div>
    );
  }

  switch (currentScreen) {
    case 'onboarding':
      return renderOnboarding();
    case 'main':
      return renderMain();
    case 'signin':
      return renderSignIn();
    case 'settings':
      return renderSettings();
    default:
      return renderOnboarding();
  }
};

export default App;
