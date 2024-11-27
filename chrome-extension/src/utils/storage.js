// chreme-extension/src/utils/storage.js
export const getStoredApiKey = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey'], (result) => {
      resolve(result.apiKey || null);
    });
  });
};

export const setStoredApiKey = (apiKey) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ apiKey }, resolve);
  });
};

export const getStoredPrimaryNode = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['primaryNode'], (result) => {
      resolve(result.primaryNode || null);
    });
  });
};

export const setStoredPrimaryNode = (node) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ primaryNode: node }, resolve);
  });
};
