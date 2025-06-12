(function() {
  'use strict';
  
  // Wait for DOM content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    initDemoPreview();
  });
  
  function initDemoPreview() {
    // Look for the demo widget preview container
    const previewContainer = document.querySelector('.h-\\[380px\\]');
    if (!previewContainer) return;
    
    const demoButton = previewContainer.querySelector('button');
    const widgetMockup = previewContainer.querySelector('.shadow-xl');
    const realWidgetButton = document.getElementById('qualify-demo-button');
    const realWidgetChat = document.getElementById('qualify-demo-chat');
    
    if (!demoButton || !widgetMockup || !realWidgetButton) {
      console.log('Demo preview elements not found');
      return;
    }
    
    // Add click event to the demo button in the preview
    demoButton.addEventListener('click', function() {
      // Hide the demo button in the preview
      demoButton.style.opacity = '0';
      demoButton.style.pointerEvents = 'none';
      
      // Show the widget mockup
      widgetMockup.style.transform = 'translateY(0)';
      widgetMockup.style.opacity = '1';
      
      // If the global qualify function exists, open the real chat widget
      if (window.qualify) {
        window.qualify('open');
      } else if (realWidgetButton) {
        // Fallback: click the real widget button directly
        realWidgetButton.click();
      }
    });
    
    // Add click event to the close button in the mockup
    const closeBtn = widgetMockup.querySelector('.w-6.h-6');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        // Hide the widget mockup
        widgetMockup.style.transform = 'translateY(20px)';
        widgetMockup.style.opacity = '0';
        
        // Show the demo button again
        setTimeout(function() {
          demoButton.style.opacity = '1';
          demoButton.style.pointerEvents = 'auto';
        }, 300);
        
        // If the global qualify function exists, close the real chat widget
        if (window.qualify) {
          window.qualify('close');
        }
      });
    }
    
    // Style the widget mockup to be hidden initially
    widgetMockup.style.transform = 'translateY(20px)';
    widgetMockup.style.opacity = '0';
    widgetMockup.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    
    // Style the demo button to be visible initially
    demoButton.style.transform = 'translateY(0)';
    demoButton.style.opacity = '1';
    demoButton.style.transition = 'opacity 0.3s ease';
    
    // Watch for real widget visibility changes
    if (realWidgetChat) {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'style') {
            const isVisible = realWidgetChat.style.display === 'block';
            
            if (!isVisible) {
              // Real chat was closed, update our preview
              widgetMockup.style.transform = 'translateY(20px)';
              widgetMockup.style.opacity = '0';
              
              setTimeout(function() {
                demoButton.style.opacity = '1';
                demoButton.style.pointerEvents = 'auto';
              }, 300);
            }
          }
        });
      });
      
      observer.observe(realWidgetChat, { attributes: true });
    }
  }
})();
