class OverlayInjector {
  private shadowHost: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;

  createShadowDOM(): ShadowRoot {
    // Check if we already have a shadow host
    this.shadowHost = document.getElementById('paygrade-root');
    
    if (!this.shadowHost) {
      this.shadowHost = document.createElement('div');
      this.shadowHost.id = 'paygrade-root';
      document.body.appendChild(this.shadowHost);
    }

    // Attach shadow root if not already attached
    if (!this.shadowRoot) {
      this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
      
      // Add base styles
      this.addBaseStyles();
    }

    return this.shadowRoot;
  }

  private addBaseStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 2147483647;
        width: 320px;
        height: 100vh;
        background: #FAFAF9;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        transition: transform 0.3s ease;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body, html {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #1C1A17;
      }

      .hidden {
        transform: translateX(100%);
      }

      .visible {
        transform: translateX(0);
      }

      /* ── GLOBAL STYLES ─────────────────── */
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#d5cec4;border-radius:2px}

      /* ── OVERLAY STYLES ─────────────────── */
      
      /* OVERLAY palette — warm off-white */
      :root {
        --cream:    #fafaf8;
        --white:    #ffffff;
        --stone:    #f4f0eb;
        --border:   #e4ddd4;
        --border-2: #d5cec4;
        --ink:      #1c1a17;
        --ink-2:    #5c5650;
        --ink-3:    #9c9490;
        --green:    #15803d;
        --green-bg: #f0fdf4;
        --green-bdr:#bbf7d0;
        --amber:    #d97706;
        --amber-bg: #fffbeb;
        --amber-bdr:#fde68a;
        --red:      #dc2626;
        --red-bg:   #fef2f2;
        --red-bdr:  #fecaca;
        --blue:     #1d4ed8;
        --blue-bg:  #eff6ff;
        --blue-bdr: #bfdbfe;
        --sans: 'DM Sans', system-ui, sans-serif;
        --mono: 'DM Mono', monospace;
      }

      /* OVERLAY container */
      .overlay {
        width: 320px;
        background: var(--cream);
        border: 1px solid var(--border);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        overflow: hidden;
        display: none;
        flex-direction: column;
        font-family: var(--sans);
        font-size: 13px;
        color: var(--ink);
      }

      .overlay.active { display: flex; }

      /* Overlay header */
      .ov-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px 9px;
        border-bottom: 1px solid var(--border);
        background: var(--white);
      }

      .ov-logo {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 700;
        color: var(--ink);
        letter-spacing: -0.3px;
      }

      .ov-logo-mark {
        width: 20px;
        height: 20px;
        background: var(--ink);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        font-weight: 700;
      }

      .ov-header-right {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ov-icon-btn {
        width: 24px;
        height: 24px;
        border: none;
        background: none;
        color: var(--ink-3);
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background 0.12s, color 0.12s;
      }

      .ov-icon-btn:hover { background: var(--stone); color: var(--ink-2); }

      /* Role detected row */
      .ov-role-row {
        padding: 9px 14px 8px;
        background: var(--white);
        border-bottom: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .ov-role-text {
        font-size: 12px;
        color: var(--ink-2);
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .ov-role-text strong { color: var(--ink); font-weight: 600; }

      .confidence-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        padding: 2px 7px;
        border-radius: 20px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .confidence-badge.high {
        background: var(--green-bg);
        color: var(--green);
        border: 1px solid var(--green-bdr);
      }

      .confidence-badge.medium {
        background: var(--amber-bg);
        color: var(--amber);
        border: 1px solid var(--amber-bdr);
      }

      .confidence-badge.low {
        background: var(--red-bg);
        color: var(--red);
        border: 1px solid var(--red-bdr);
      }

      /* Salary hiding banner */
      .salary-hiding-banner {
        padding: 9px 14px;
        background: var(--amber-bg);
        border-bottom: 1px solid var(--amber-bdr);
        display: flex;
        gap: 8px;
        font-size: 12px;
        color: #92400e;
        line-height: 1.5;
      }

      /* Main salary card */
      .ov-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

      .salary-card {
        background: var(--white);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px;
      }

      .salary-card-label {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ink-3);
        margin-bottom: 10px;
      }

      .salary-range-numbers {
        font-size: 20px;
        font-weight: 700;
        color: var(--ink);
        letter-spacing: -0.5px;
        margin-bottom: 4px;
        line-height: 1.2;
      }

      .salary-median-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 12px;
      }

      .salary-median-label {
        font-size: 11px;
        color: var(--ink-2);
      }

      .salary-median-value {
        font-size: 13px;
        font-weight: 600;
        color: var(--green);
      }

      /* Range bar */
      .range-bar {
        position: relative;
        height: 6px;
        background: var(--stone);
        border-radius: 3px;
        margin-bottom: 10px;
      }

      .range-bar-fill {
        position: absolute;
        left: 0;
        height: 100%;
        border-radius: 3px;
        background: linear-gradient(90deg, #bbf7d0, #15803d);
      }

      .range-bar-marker {
        position: absolute;
        top: -3px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--white);
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        transform: translateX(-50%);
      }

      .range-bar-marker.median { background: var(--green); }
      .range-bar-marker.posted { background: var(--amber); }

      .range-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--ink-3);
        font-family: var(--mono);
      }

      /* Confidence dots */
      .confidence-dots {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border);
      }

      .conf-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--green);
      }

      .conf-dot.empty { background: var(--stone); }

      .conf-text {
        font-size: 11px;
        color: var(--ink-3);
        margin-left: 4px;
      }

      /* Posted salary comparison */
      .posted-comparison {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 12px;
        gap: 8px;
      }

      .posted-comparison.fair {
        background: var(--green-bg);
        border: 1px solid var(--green-bdr);
      }

      .posted-comparison.below {
        background: var(--amber-bg);
        border: 1px solid var(--amber-bdr);
      }

      .posted-comparison.above {
        background: var(--blue-bg);
        border: 1px solid var(--blue-bdr);
      }

      .posted-label { color: var(--ink-2); flex: 1; }
      .posted-label strong { color: var(--ink); }

      .posted-badge {
        font-size: 10.5px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 20px;
        white-space: nowrap;
      }

      .posted-badge.fair { color: var(--green); background: white; }
      .posted-badge.below { color: var(--amber); background: white; }

      /* Negotiation panel */
      .negotiation-panel {
        background: var(--ink);
        border-radius: 10px;
        padding: 12px 14px;
        color: #e8e4df;
      }

      .neg-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #f59e0b;
        margin-bottom: 8px;
      }

      .neg-body {
        font-size: 12px;
        line-height: 1.6;
        color: #c8c4be;
      }

      /* Sources row */
      .sources-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: var(--ink-3);
        padding: 0 2px;
      }

      .source-chips {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }

      .source-chip {
        padding: 2px 7px;
        border-radius: 20px;
        border: 1px solid var(--border);
        background: var(--stone);
        font-size: 10px;
        color: var(--ink-2);
      }

      /* Similar roles */
      .similar-roles { display: flex; flex-direction: column; gap: 5px; }

      .similar-label {
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--ink-3);
        margin-bottom: 2px;
      }

      .similar-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 7px 10px;
        border-radius: 7px;
        border: 1px solid var(--border);
        background: var(--white);
        font-size: 12px;
        gap: 8px;
        cursor: pointer;
        transition: background 0.1s;
      }

      .similar-row:hover { background: var(--stone); }

      .similar-role-name { flex: 1; color: var(--ink-2); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .similar-company { color: var(--ink-3); font-size: 11px; width: 70px; text-align: right; white-space: nowrap; }
      .similar-range { font-family: var(--mono); font-size: 10.5px; color: var(--green); font-weight: 500; white-space: nowrap; }

      /* Actions row */
      .ov-actions {
        display: flex;
        gap: 6px;
      }

      .ov-action-btn {
        flex: 1;
        height: 34px;
        border: 1px solid var(--border);
        border-radius: 7px;
        background: var(--white);
        color: var(--ink-2);
        font-family: var(--sans);
        font-size: 11.5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: background 0.12s, border-color 0.12s, color 0.12s;
      }

      .ov-action-btn:hover { background: var(--stone); border-color: var(--border-2); color: var(--ink); }

      /* Footer */
      .ov-footer {
        border-top: 1px solid var(--border);
        padding: 9px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--stone);
      }

      .ov-footer-left { font-size: 11px; color: var(--ink-3); }
      .ov-footer-left a { color: var(--blue); cursor: pointer; text-decoration: none; }
      .ov-footer-left a:hover { text-decoration: underline; }

      .ov-upgrade-btn {
        padding: 5px 12px;
        background: var(--ink);
        border: none;
        border-radius: 6px;
        color: #fff;
        font-family: var(--sans);
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.12s;
      }
      .ov-upgrade-btn:hover { background: #3a3632; }

      /* ── OVERLAY ERROR STATES ───────────── */
      .ov-error {
        padding: 20px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
      }

      .ov-error-icon { font-size: 28px; }
      .ov-error-heading { font-size: 13.5px; font-weight: 600; color: var(--ink); }
      .ov-error-body { font-size: 12px; color: var(--ink-2); line-height: 1.55; max-width: 230px; }

      .ov-error-btns { display: flex; flex-direction: column; gap: 6px; width: 100%; margin-top: 4px; }

      .ov-err-btn-primary {
        width: 100%;
        height: 36px;
        background: var(--ink);
        border: none;
        border-radius: 7px;
        color: #fff;
        font-family: var(--sans);
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.12s;
      }

      .ov-err-btn-primary:hover { background: #3a3632; }

      .ov-err-btn-sec {
        width: 100%;
        height: 34px;
        background: transparent;
        border: 1px solid var(--border-2);
        border-radius: 7px;
        color: var(--ink-2);
        font-family: var(--sans);
        font-size: 12px;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
      }

      .ov-err-btn-sec:hover { background: var(--stone); color: var(--ink); }

      /* Loading state */
      .ov-loading {
        padding: 28px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .ov-spinner {
        width: 28px;
        height: 28px;
        border: 2.5px solid var(--border);
        border-top-color: var(--ink);
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
      }

      @keyframes spin { to { transform: rotate(360deg); } }

      .ov-loading-text { font-size: 12.5px; color: var(--ink-2); }
    `;
    
    this.shadowRoot?.appendChild(style);
  }

  show(): void {
    if (this.shadowHost) {
      this.shadowHost.classList.remove('hidden');
      this.shadowHost.classList.add('visible');
    }
  }

  hide(): void {
    if (this.shadowHost) {
      this.shadowHost.classList.remove('visible');
      this.shadowHost.classList.add('hidden');
    }
  }

  isVisible(): boolean {
    return !!this.shadowHost && this.shadowHost.classList.contains('visible');
  }

  render(content: HTMLElement): void {
    if (!this.shadowRoot) {
      this.createShadowDOM();
    }

    // Clear existing content
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      
      // Re-add base styles
      this.addBaseStyles();
      
      // Add new content
      this.shadowRoot.appendChild(content);
    }
  }

  remove(): void {
    if (this.shadowHost && this.shadowHost.parentNode) {
      this.shadowHost.parentNode.removeChild(this.shadowHost);
      this.shadowHost = null;
      this.shadowRoot = null;
    }
  }

  async rememberDismissal(url: string): Promise<void> {
    try {
      const dismissedUrls = await this.getDismissedUrls();
      if (!dismissedUrls.includes(url)) {
        dismissedUrls.push(url);
        await chrome.storage.local.set({ paygradeDismissedUrls: dismissedUrls });
      }
    } catch (error) {
      console.error('Failed to remember dismissal:', error);
    }
  }

  async wasDismissed(url: string): Promise<boolean> {
    try {
      const dismissedUrls = await this.getDismissedUrls();
      return dismissedUrls.includes(url);
    } catch (error) {
      console.error('Failed to check dismissal:', error);
      return false;
    }
  }

  private async getDismissedUrls(): Promise<string[]> {
    const result = await chrome.storage.local.get(['paygradeDismissedUrls']);
    return result.paygradeDismissedUrls || [];
  }
}

export default new OverlayInjector();
