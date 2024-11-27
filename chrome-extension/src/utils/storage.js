// chrome-extension/src/utils/storage.js
export const getStoredApiKey = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], (result) => {
      resolve(result.apiKey || null);
    });
  });
};

export const getStoredUserId = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['userId'], (result) => {
      resolve(result.userId || null);
    });
  });
};

export const setStoredCredentials = (apiKey, userId) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ apiKey, userId }, resolve);
  });
};
