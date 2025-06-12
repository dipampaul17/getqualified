(function() {
  'use strict';
  
  // Browser compatibility checks
  if (!window.customElements || !document.head.attachShadow) {
    console.warn('Qualify.ai: Browser does not support required features');
    return;
  }
  
  // Polyfill for older browsers
  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      return this.indexOf(search, start) !== -1;
    };
  }
  
  // Configuration
  const API_BASE = window.QualifyAI?.apiUrl || 'http://localhost:3000';
  const WIDGET_ID = 'qualify-widget-' + Math.random().toString(36).substr(2, 9);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  
  // Get API key from script tag
  const script = document.currentScript || document.querySelector('script[data-key]');
  const apiKey = script?.getAttribute('data-key');
  
  if (!apiKey) {
    console.error('Qualify.ai: Missing data-key attribute');
    return;
  }
  
  // Device detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Create widget container with Shadow DOM
  const container = document.createElement('div');
  container.id = WIDGET_ID;
  container.style.cssText = isMobile 
    ? 'position:fixed;bottom:16px;right:16px;left:16px;z-index:2147483647;'
    : 'position:fixed;bottom:24px;right:24px;z-index:2147483647;';
  
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Inject styles and initial HTML
  shadow.innerHTML = `
    <style>
      * { 
        box-sizing: border-box; 
        margin: 0; 
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .widget {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        width: ${isMobile ? '100%' : '380px'};
        max-width: ${isMobile ? '100%' : 'calc(100vw - 48px)'};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        transition: all 0.3s ease;
        transform-origin: bottom right;
        -webkit-overflow-scrolling: touch;
      }
      .widget.minimized {
        width: 64px;
        height: 64px;
        cursor: pointer;
      }
      .widget-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        position: relative;
      }
      .widget-body {
        padding: 20px;
        max-height: ${isMobile ? '60vh' : '400px'};
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .question {
        font-size: ${isMobile ? '18px' : '16px'};
        line-height: 1.5;
        color: #1f2937;
        margin-bottom: 16px;
      }
      .input-wrapper {
        position: relative;
      }
      .input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        /* Prevent zoom on iOS */
        font-size: 16px !important;
      }
      .input:focus {
        outline: none;
        border-color: #3b82f6;
      }
      /* Fix for iOS Safari */
      @supports (-webkit-touch-callout: none) {
        .input {
          font-size: 16px !important;
        }
      }
      .submit-btn {
        margin-top: 12px;
        padding: ${isMobile ? '14px 24px' : '12px 24px'};
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
        width: ${isMobile ? '100%' : 'auto'};
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        -webkit-tap-highlight-color: transparent;
      }
      .submit-btn:hover {
        background: #2563eb;
      }
      .submit-btn:active {
        background: #1d4ed8;
      }
      .submit-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      .powered-by {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
      }
      .powered-by a {
        color: #6b7280;
        font-size: 12px;
        text-decoration: none;
        transition: color 0.2s;
      }
      .powered-by a:hover {
        color: #3b82f6;
      }
      /* Loading spinner */
      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f4f6;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      /* Error state */
      .error-message {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 16px;
      }
      /* Offline indicator */
      .offline-indicator {
        background: #f59e0b;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        text-align: center;
        margin-bottom: 12px;
      }
      /* Mobile optimizations */
      @media (max-width: 768px) {
        .widget-header {
          padding: 16px;
        }
        .widget-body {
          padding: 16px;
        }
      }
    </style>
    <div class="widget minimized" id="widget-container">
      <div style="display:flex;align-items:center;justify-content:center;height:100%;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </div>
  `;
  
  // Add container to page
  document.body.appendChild(container);
  
  // Widget state
  let state = {
    open: false,
    questions: [],
    answers: [],
    currentQuestion: 0,
    visitorId: getOrCreateVisitorId(),
    sessionId: generateSessionId(),
    startTime: Date.now(),
    offline: !navigator.onLine,
    device: {
      type: isMobile ? 'mobile' : 'desktop',
      os: getOS(),
      browser: getBrowser(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  };
  
  // Offline queue for failed requests
  const offlineQueue = [];
  
  // Helper functions
  function getOrCreateVisitorId() {
    try {
      let id = localStorage.getItem('qualify_visitor_id');
      if (!id) {
        id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('qualify_visitor_id', id);
      }
      return id;
    } catch (e) {
      // localStorage might be blocked
      return 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
  }
  
  function generateSessionId() {
    return 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  function getOS() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    return 'Unknown';
  }
  
  function getBrowser() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
  
  // Network status handling
  window.addEventListener('online', () => {
    state.offline = false;
    processOfflineQueue();
  });
  
  window.addEventListener('offline', () => {
    state.offline = true;
  });
  
  // Retry mechanism with exponential backoff
  async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
      return response;
    } catch (error) {
      if (retries > 0 && !state.offline) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }
  
  // Process offline queue when back online
  async function processOfflineQueue() {
    while (offlineQueue.length > 0) {
      const request = offlineQueue.shift();
      try {
        await fetchWithRetry(request.url, request.options);
      } catch (error) {
        console.error('Failed to process offline request:', error);
      }
    }
  }
  
  // Verify installation
  async function verifyInstallation() {
    try {
      const response = await fetch(`${API_BASE}/api/widget/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey,
          domain: window.location.hostname
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Qualify.ai: Widget verified -', data.message);
      }
    } catch (error) {
      console.warn('Qualify.ai: Could not verify installation');
    }
  }
  
  // Initialize widget
  async function init() {
    try {
      // Verify installation first
      verifyInstallation();
      
      // Enhanced tracking data
      const initData = {
        apiKey: apiKey,
        visitorId: state.visitorId,
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer,
        device: state.device,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        timestamp: new Date().toISOString()
      };
      
      // Check A/B test assignment
      const response = await fetchWithRetry(`${API_BASE}/api/widget/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initData)
      });
      
      if (!response.ok) {
        throw new Error('Init failed');
      }
      
      const data = await response.json();
      
      if (!data.showWidget) {
        // Control group - don't show widget
        container.remove();
        return;
      }
      
      state.questions = data.questions || getDefaultQuestions();
      
      // Set up event listeners
      const widgetEl = shadow.getElementById('widget-container');
      widgetEl.addEventListener('click', handleWidgetClick);
      
      // Handle mobile viewport changes
      if (isMobile) {
        window.addEventListener('resize', handleViewportChange);
      }
      
      // Auto-open after delay (longer on mobile)
      const delay = isMobile ? 5000 : 3000;
      setTimeout(() => {
        if (!state.open) {
          openWidget();
        }
      }, delay);
      
    } catch (error) {
      console.error('Qualify.ai: Failed to initialize', error);
      // Fall back to default questions
      state.questions = getDefaultQuestions();
      
      // Still set up widget for offline mode
      const widgetEl = shadow.getElementById('widget-container');
      widgetEl.addEventListener('click', handleWidgetClick);
    }
  }
  
  function getDefaultQuestions() {
    return [
      { id: 'intent', text: 'What brings you here today?' },
      { id: 'timeline', text: 'When are you looking to get started?' },
      { id: 'size', text: 'How large is your team?' }
    ];
  }
  
  function handleViewportChange() {
    // Adjust widget position on mobile keyboard open/close
    if (isMobile) {
      const widget = shadow.getElementById('widget-container');
      if (widget && state.open) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          const offsetY = window.innerHeight - visualViewport.height;
          widget.style.transform = `translateY(-${offsetY}px)`;
        }
      }
    }
  }
  
  function handleWidgetClick(e) {
    if (!state.open) {
      openWidget();
    }
  }
  
  function openWidget() {
    state.open = true;
    renderOpenWidget();
    trackEvent('widget_opened');
  }
  
  function renderOpenWidget() {
    const widget = shadow.getElementById('widget-container');
    widget.classList.remove('minimized');
    
    const currentQ = state.questions[state.currentQuestion];
    const showPoweredBy = true; // Always show for free tier
    
    widget.innerHTML = `
      <div class="widget-header">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <h3 style="font-size:18px;font-weight:600;color:#1f2937;">Quick question</h3>
          <button onclick="this.getRootNode().host.closeWidget()" style="background:none;border:none;cursor:pointer;padding:4px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="widget-body">
        ${state.offline ? '<div class="offline-indicator">You\'re offline - responses will be saved</div>' : ''}
        <div class="question">${escapeHtml(currentQ.text)}</div>
        <form id="question-form">
          <div class="input-wrapper">
            <textarea 
              id="answer-input"
              class="input"
              rows="3"
              placeholder="Type your answer..."
              autocomplete="off"
              autocorrect="on"
              autocapitalize="sentences"
              spellcheck="true"
            ></textarea>
          </div>
          <button type="submit" class="submit-btn">
            ${state.currentQuestion < state.questions.length - 1 ? 'Next' : 'Submit'}
          </button>
        </form>
        ${showPoweredBy ? `
          <div class="powered-by">
            <a href="https://qualify.ai?ref=${apiKey}" target="_blank" rel="noopener">
              🤖 AI Qualified by Qualify.ai
            </a>
          </div>
        ` : ''}
      </div>
    `;
    
    // Add form listener
    const form = shadow.getElementById('question-form');
    form.addEventListener('submit', handleSubmit);
    
    // Focus input after a delay (for mobile keyboards)
    setTimeout(() => {
      const input = shadow.getElementById('answer-input');
      if (input && !isMobile) {
        input.focus();
      }
    }, 100);
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const input = shadow.getElementById('answer-input');
    const answer = input.value.trim();
    
    if (!answer) return;
    
    // Save answer with metadata
    state.answers.push({
      questionId: state.questions[state.currentQuestion].id,
      question: state.questions[state.currentQuestion].text,
      answer: answer,
      timestamp: new Date().toISOString(),
      timeToAnswer: Date.now() - state.startTime
    });
    
    // Track answer
    trackEvent('question_answered', {
      questionId: state.questions[state.currentQuestion].id,
      answerLength: answer.length,
      questionIndex: state.currentQuestion
    });
    
    // Move to next question or submit
    if (state.currentQuestion < state.questions.length - 1) {
      state.currentQuestion++;
      state.startTime = Date.now(); // Reset timer for next question
      renderOpenWidget();
    } else {
      await submitResponses();
    }
  }
  
  async function submitResponses() {
    const submitBtn = shadow.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    
    try {
      const submissionData = {
        apiKey: apiKey,
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        pageUrl: window.location.href,
        pageTitle: document.title,
        answers: state.answers,
        device: state.device,
        totalTime: Date.now() - state.startTime,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetchWithRetry(`${API_BASE}/api/widget/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        throw new Error('Submit failed');
      }
      
      const data = await response.json();
      
      // Save to localStorage for offline recovery
      try {
        localStorage.setItem('qualify_last_submission', JSON.stringify({
          timestamp: new Date().toISOString(),
          qualified: data.qualified,
          score: data.score
        }));
      } catch (e) {
        // Ignore localStorage errors
      }
      
      if (data.qualified) {
        renderQualifiedState(data);
      } else {
        renderThankYouState();
      }
      
      trackEvent('form_completed', {
        qualified: data.qualified,
        score: data.score
      });
      
    } catch (error) {
      console.error('Qualify.ai: Failed to submit', error);
      
      // Queue for offline processing
      if (state.offline) {
        offlineQueue.push({
          url: `${API_BASE}/api/widget/submit`,
          options: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionData),
          }
        });
        renderOfflineState();
      } else {
        renderErrorState();
      }
    }
  }
  
  function renderQualifiedState(data) {
    const widget = shadow.getElementById('widget-container');
    widget.innerHTML = `
      <div class="widget-body" style="text-align:center;padding:40px 20px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin:0 auto 16px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h3 style="font-size:20px;font-weight:600;color:#1f2937;margin-bottom:8px;">Great! You qualify!</h3>
        <p style="color:#6b7280;margin-bottom:24px;">Based on your responses, we'd love to show you a demo.</p>
        ${data.calendlyUrl ? `
          <a href="${data.calendlyUrl}" target="_blank" rel="noopener" class="submit-btn" style="display:inline-block;text-decoration:none;">
            Schedule Demo
          </a>
        ` : `
          <p style="color:#3b82f6;font-weight:500;">Someone will reach out within 24 hours!</p>
        `}
      </div>
    `;
  }
  
  function renderThankYouState() {
    const widget = shadow.getElementById('widget-container');
    widget.innerHTML = `
      <div class="widget-body" style="text-align:center;padding:40px 20px;">
        <h3 style="font-size:20px;font-weight:600;color:#1f2937;margin-bottom:8px;">Thanks for your responses!</h3>
        <p style="color:#6b7280;">We'll be in touch if we can help.</p>
      </div>
    `;
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      container.remove();
    }, 3000);
  }
  
  function renderErrorState() {
    const widget = shadow.getElementById('widget-container');
    widget.innerHTML = `
      <div class="widget-body" style="text-align:center;padding:40px 20px;">
        <div class="error-message">
          <p>Something went wrong. Please try again later.</p>
        </div>
        <button onclick="location.reload()" class="submit-btn">
          Reload Page
        </button>
      </div>
    `;
  }
  
  function renderOfflineState() {
    const widget = shadow.getElementById('widget-container');
    widget.innerHTML = `
      <div class="widget-body" style="text-align:center;padding:40px 20px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="margin:0 auto 16px;">
          <path d="M8.5 2L8.5 8L2.5 8"></path>
          <path d="M15.5 22L15.5 16L21.5 16"></path>
          <path d="M22 12A10 10 0 0 0 12 2L12 2A10 10 0 0 0 8.5 2"></path>
          <path d="M2 12A10 10 0 0 0 12 22L12 22A10 10 0 0 0 15.5 22"></path>
        </svg>
        <h3 style="font-size:20px;font-weight:600;color:#1f2937;margin-bottom:8px;">Saved offline</h3>
        <p style="color:#6b7280;">Your responses have been saved and will be submitted when you're back online.</p>
      </div>
    `;
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      container.remove();
    }, 5000);
  }
  
  async function trackEvent(eventType, metadata = {}) {
    try {
      const trackingData = {
        apiKey: apiKey,
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        eventType: eventType,
        pageUrl: window.location.href,
        metadata: {
          ...metadata,
          device: state.device.type,
          browser: state.device.browser,
          timestamp: new Date().toISOString()
        }
      };
      
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(trackingData)], { type: 'application/json' });
        navigator.sendBeacon(`${API_BASE}/api/widget/track`, blob);
      } else {
        // Fallback to fetch
        fetch(`${API_BASE}/api/widget/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trackingData),
          keepalive: true
        });
      }
      
      // If offline, queue the event
      if (state.offline) {
        offlineQueue.push({
          url: `${API_BASE}/api/widget/track`,
          options: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trackingData),
            keepalive: true
          }
        });
      }
    } catch (error) {
      // Fail silently - don't break user experience
    }
  }
  
  // Expose close function
  container.closeWidget = function() {
    container.remove();
    trackEvent('widget_closed');
  };
  
  // Handle page unload
  window.addEventListener('beforeunload', function() {
    if (state.answers.length > 0 && state.currentQuestion < state.questions.length) {
      trackEvent('widget_abandoned', {
        questionsAnswered: state.answers.length,
        totalQuestions: state.questions.length
      });
    }
  });
  
  // Initialize
  init();
})();
