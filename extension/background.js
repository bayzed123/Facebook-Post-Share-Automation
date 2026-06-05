/**
 * background.js
 * Service worker for handling tab management and cross-origin automation
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_TASK') {
    const { targetUrl, workspaceName } = message.payload;
    console.log(`[FB Automation] Starting task for ${workspaceName} on ${targetUrl}`);

    // Create a new tab for Facebook automation
    chrome.tabs.create({ url: targetUrl }, (tab) => {
      console.log(`[FB Automation] Opened automation tab: ${tab.id}`);
      
      // Wait for tab to load and send command to content script
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Small delay to ensure FB's dynamic UI is ready
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { 
              type: 'EXECUTE_SHARE',
              groupUrl: targetUrl 
            });
          }, 3000);
        }
      });
    });

    sendResponse({ status: 'task_initiated', tabCreated: true });
  }
  return true;
});
