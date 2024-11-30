// chrome-extension/src/background.js
chrome.runtime.onInstalled.addListener(() => {
  // Clear any existing proxy settings
  chrome.proxy.settings.clear({
    scope: 'regular'
  });
});

// Listen for proxy errors
// chrome.proxy.onProxyError.addListener((details) => {
//   console.error('Proxy error:', details);
// });
