export async function extractJDFromCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { error: 'No active tab found.' };

  const firstTry = await sendExtract(tab);
  if (!firstTry.error) return firstTry;

  await injectContentScript(tab.id);
  return sendExtract(tab);
}

function sendExtract(tab) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: 'extractJD' }, (resp) => {
      if (chrome.runtime.lastError) {
        resolve({ error: chrome.runtime.lastError.message });
        return;
      }
      resolve({
        jd: resp?.jd || '',
        title: resp?.title || '',
        sourceUrl: tab.url || ''
      });
    });
  });
}

function injectContentScript(tabId) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve();
    });
  });
}
