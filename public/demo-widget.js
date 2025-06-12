(function() {
  'use strict';
  
  // Demo widget configuration
  const DEMO_CONFIG = {
    position: 'bottom-right',
    primaryColor: '#000000',
    buttonText: 'Try Demo Chat',
    welcomeMessage: 'Hi! Experience how Qualify.ai works. This is a demo version.',
    questions: [
      {
        id: 'use_case',
        text: 'What brings you to Qualify.ai today?',
        type: 'text'
      },
      {
        id: 'company_size',
        text: 'How large is your team?',
        type: 'select',
        options: ['Just me', '2-10', '11-50', '51-200', '200+']
      },
      {
        id: 'timeline',
        text: 'When are you looking to implement a solution?',
        type: 'select',
        options: ['ASAP', 'This month', 'This quarter', 'Just exploring']
      }
    ]
  };

  // Widget HTML template
  const widgetHTML = `
    <div id="qualify-demo-widget" style="display: none;">
      <style>
        #qualify-demo-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        #qualify-demo-button {
          background: ${DEMO_CONFIG.primaryColor};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s;
        }
        
        #qualify-demo-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }
        
        #qualify-demo-chat {
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 380px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          overflow: hidden;
          transform-origin: bottom right;
          animation: qualify-demo-slideIn 0.3s ease-out;
        }
        
        @keyframes qualify-demo-slideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        #qualify-demo-header {
          background: ${DEMO_CONFIG.primaryColor};
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        #qualify-demo-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        
        #qualify-demo-close:hover {
          background: rgba(255,255,255,0.1);
        }
        
        #qualify-demo-content {
          padding: 24px 20px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .qualify-demo-message {
          margin-bottom: 16px;
          animation: qualify-demo-fadeIn 0.4s ease-out;
        }
        
        @keyframes qualify-demo-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .qualify-demo-bot-message {
          background: #f4f4f5;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          line-height: 1.5;
          color: #18181b;
        }
        
        .qualify-demo-user-message {
          background: ${DEMO_CONFIG.primaryColor};
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          margin-left: 40px;
          font-size: 14px;
          line-height: 1.5;
          text-align: right;
        }
        
        .qualify-demo-input-group {
          margin-top: 20px;
        }
        
        .qualify-demo-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .qualify-demo-input:focus {
          outline: none;
          border-color: ${DEMO_CONFIG.primaryColor};
          box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
        }
        
        .qualify-demo-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .qualify-demo-option {
          padding: 12px 16px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        
        .qualify-demo-option:hover {
          background: #f4f4f5;
          border-color: ${DEMO_CONFIG.primaryColor};
        }
        
        .qualify-demo-submit {
          background: ${DEMO_CONFIG.primaryColor};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          margin-top: 12px;
          transition: all 0.2s;
        }
        
        .qualify-demo-submit:hover {
          opacity: 0.9;
        }
        
        .qualify-demo-result {
          text-align: center;
          padding: 32px 20px;
        }
        
        .qualify-demo-score {
          font-size: 48px;
          font-weight: 700;
          color: ${DEMO_CONFIG.primaryColor};
          margin-bottom: 8px;
        }
        
        .qualify-demo-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        
        .qualify-demo-badge.qualified {
          background: #dcfce7;
          color: #166534;
        }
        
        .qualify-demo-badge.not-qualified {
          background: #fee2e2;
          color: #991b1b;
        }
        
        @media (max-width: 480px) {
          #qualify-demo-chat {
            width: calc(100vw - 40px);
            right: 50%;
            transform: translateX(50%);
          }
        }
      </style>
      
      <button id="qualify-demo-button">${DEMO_CONFIG.buttonText}</button>
      
      <div id="qualify-demo-chat" style="display: none;">
        <div id="qualify-demo-header">
          <span style="font-weight: 500;">Qualify.ai Demo</span>
          <button id="qualify-demo-close">&times;</button>
        </div>
        <div id="qualify-demo-content">
          <div class="qualify-demo-bot-message">
            ${DEMO_CONFIG.welcomeMessage}
          </div>
        </div>
      </div>
    </div>
  `;

  // State management
  let isOpen = false;
  let currentQuestion = 0;
  let responses = {};
  let startTime = null;

  // Initialize widget
  function init() {
    // Create container and inject HTML
    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    document.body.appendChild(container.firstElementChild);

    // Get elements
    const widget = document.getElementById('qualify-demo-widget');
    const button = document.getElementById('qualify-demo-button');
    const chat = document.getElementById('qualify-demo-chat');
    const closeBtn = document.getElementById('qualify-demo-close');
    const content = document.getElementById('qualify-demo-content');

    // Show widget after a delay
    setTimeout(() => {
      widget.style.display = 'block';
    }, 2000);

    // Event listeners
    button.addEventListener('click', () => openChat());
    closeBtn.addEventListener('click', () => closeChat());

    // Helper functions
    function openChat() {
      isOpen = true;
      button.style.display = 'none';
      chat.style.display = 'block';
      startTime = Date.now();
      
      // Start conversation after a short delay
      setTimeout(() => {
        askQuestion();
      }, 1000);
    }

    function closeChat() {
      isOpen = false;
      button.style.display = 'block';
      chat.style.display = 'none';
      
      // Reset state
      currentQuestion = 0;
      responses = {};
      content.innerHTML = `<div class="qualify-demo-bot-message">${DEMO_CONFIG.welcomeMessage}</div>`;
    }

    function askQuestion() {
      if (currentQuestion >= DEMO_CONFIG.questions.length) {
        showResult();
        return;
      }

      const question = DEMO_CONFIG.questions[currentQuestion];
      const botMessage = document.createElement('div');
      botMessage.className = 'qualify-demo-bot-message';
      botMessage.textContent = question.text;
      content.appendChild(botMessage);

      const inputGroup = document.createElement('div');
      inputGroup.className = 'qualify-demo-input-group';

      if (question.type === 'select' && question.options) {
        question.options.forEach(option => {
          const optionBtn = document.createElement('div');
          optionBtn.className = 'qualify-demo-option';
          optionBtn.textContent = option;
          optionBtn.addEventListener('click', () => handleResponse(option));
          inputGroup.appendChild(optionBtn);
        });
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'qualify-demo-input';
        input.placeholder = 'Type your answer...';
        
        const submitBtn = document.createElement('button');
        submitBtn.className = 'qualify-demo-submit';
        submitBtn.textContent = 'Send';
        submitBtn.addEventListener('click', () => {
          if (input.value.trim()) {
            handleResponse(input.value.trim());
          }
        });

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && input.value.trim()) {
            handleResponse(input.value.trim());
          }
        });

        inputGroup.appendChild(input);
        inputGroup.appendChild(submitBtn);
        
        setTimeout(() => input.focus(), 100);
      }

      content.appendChild(inputGroup);
      content.scrollTop = content.scrollHeight;
    }

    function handleResponse(response) {
      const question = DEMO_CONFIG.questions[currentQuestion];
      responses[question.id] = response;

      // Remove input group
      const inputGroup = content.querySelector('.qualify-demo-input-group');
      if (inputGroup) inputGroup.remove();

      // Add user message
      const userMessage = document.createElement('div');
      userMessage.className = 'qualify-demo-user-message';
      userMessage.textContent = response;
      content.appendChild(userMessage);

      // Move to next question
      currentQuestion++;
      setTimeout(() => askQuestion(), 800);
    }

    function showResult() {
      // Calculate mock score based on responses
      let score = Math.random() * 0.4 + 0.6; // 60-100
      
      // Adjust based on timeline response
      if (responses.timeline === 'ASAP' || responses.timeline === 'This month') {
        score = Math.min(1, score + 0.2);
      } else if (responses.timeline === 'Just exploring') {
        score = Math.max(0.3, score - 0.3);
      }

      const qualified = score >= 0.7;
      const totalTime = Date.now() - startTime;

      // Show result
      const resultDiv = document.createElement('div');
      resultDiv.className = 'qualify-demo-result';
      resultDiv.innerHTML = `
        <div class="qualify-demo-score">${Math.round(score * 100)}</div>
        <div class="qualify-demo-badge ${qualified ? 'qualified' : 'not-qualified'}">
          ${qualified ? '✓ Qualified Lead' : 'Not Qualified'}
        </div>
        <p style="color: #71717a; font-size: 14px; margin-bottom: 20px;">
          ${qualified 
            ? 'Great! In a real scenario, you\'d be instantly notified about this hot lead.' 
            : 'This lead needs more nurturing before they\'re sales-ready.'}
        </p>
        <p style="color: #18181b; font-size: 14px; font-weight: 500;">
          This demo shows how Qualify.ai works in ${Math.round(totalTime / 1000)}s
        </p>
        <button class="qualify-demo-submit" onclick="window.location.href='/onboard'">
          Get Qualify.ai for Your Site →
        </button>
      `;
      
      content.appendChild(resultDiv);
      content.scrollTop = content.scrollHeight;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 