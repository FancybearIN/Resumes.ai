export async function analyzeWithOpenRouter(payload) {
  return sendMessage('analyzeResume', payload);
}

export async function regeneratePromptWithOpenRouter(payload) {
  return sendMessage('regeneratePrompt', payload);
}

export async function testApiKeyWithOpenRouter() {
  return sendMessage('testApiKey', {});
}

function sendMessage(action, payload) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action, payload }, (resp) => {
      if (chrome.runtime.lastError) {
        resolve({ error: chrome.runtime.lastError.message });
        return;
      }
      resolve(resp || { error: 'No response from background.' });
    });
  });
}
