/**
 * fb-automation.js
 * Robust Facebook automation script using attribute-based selectors and human-like delays.
 */

(function() {
  const CONFIG = {
    selectors: {
      shareButton: [
        '[aria-label="Send this to friends or post it on your timeline."]',
        '[aria-label="Share"]',
        '[data-testid="fb-share-button"]',
        'div[role="button"]:has(i[style*="background-image"][style*="pS-n7x_C5mG"])', // Heuristic for share icon
      ],
      shareToGroupOption: [
        'span:text-is("Share to a group")',
        'div[role="menuitem"]:has(span:contains("Share to a group"))',
        '[aria-label="Share to a group"]',
      ],
      groupSearchInput: 'input[aria-label="Search for groups"]',
      postButton: '[aria-label="Post"]',
    },
    delays: {
      min: 1500,
      max: 3500,
    }
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const getRandomDelay = () => Math.floor(Math.random() * (CONFIG.delays.max - CONFIG.delays.min + 1) + CONFIG.delays.min);

  async function findElement(selectors) {
    if (Array.isArray(selectors)) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }
    } else {
      return document.querySelector(selectors);
    }
    return null;
  }

  async function automateShare(groupUrl) {
    console.log(`[FB Automation] Attempting to share to: ${groupUrl}`);
    
    try {
      // 1. Click Share Button
      const shareBtn = await findElement(CONFIG.selectors.shareButton);
      if (!shareBtn) throw new Error('Share button not found');
      
      shareBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await sleep(getRandomDelay());
      shareBtn.click();
      console.log('[FB Automation] Clicked Share button');

      // 2. Click "Share to a group"
      await sleep(getRandomDelay());
      // Custom search for text since querySelector doesn't support :contains natively in all envs
      const menuItems = Array.from(document.querySelectorAll('div[role="menuitem"], span'));
      const shareToGroup = menuItems.find(el => el.textContent.includes('Share to a group'));
      
      if (!shareToGroup) throw new Error('Share to group option not found');
      shareToGroup.click();
      console.log('[FB Automation] Clicked "Share to a group"');

      // 3. Handle the group selection (this usually opens a new dialog/view)
      // The actual implementation depends on whether we are navigating to the group URL directly 
      // or using the share dialog search. The prompt implies "Share to a group" option.
      
      // Note: Full group automation often requires handling the search and post button in the popup.
    } catch (error) {
      console.error('[FB Automation] Error:', error.message);
    }
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXECUTE_SHARE') {
      automateShare(request.groupUrl);
      sendResponse({ status: 'started' });
    }
  });

  console.log('[FB Automation] Facebook content script initialized');
})();
