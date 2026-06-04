/**
 * dashboard.js
 * Content script that listens for CustomEvents from the React Dashboard
 */

console.log('[FB Automation] Extension bridge loaded on dashboard');

window.addEventListener('START_AUTOMATION_TASK', (event) => {
  const payload = event.detail;
  console.log('[FB Automation] Received task signal:', payload);

  // Send message to background script to handle tab management and automation
  chrome.runtime.sendMessage({
    type: 'START_TASK',
    payload: payload
  }, (response) => {
    console.log('[FB Automation] Background script acknowledged:', response);
  });
});
