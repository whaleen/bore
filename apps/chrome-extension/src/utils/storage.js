// src/utils/storage.js
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

export const getStoredConnectionId = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['connectionId'], (result) => {
      resolve(result.connectionId || null);
    });
  });
};

export const setStoredCredentials = (apiKey, userId, connection) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      apiKey,
      userId,
      connectionId: connection?.id || null
    }, resolve);
  });
};

// Add helper to get auth headers
export const getAuthHeaders = async () => {
  const apiKey = await getStoredApiKey();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
};
