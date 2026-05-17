function cleanText(text) {
  return text
    .replace(/\s{2,}/g, ' ')
    .replace(/Cookie Preferences|Sign in|Apply now|Privacy Policy/gi, ' ')
    .trim();
}

function extractFromSelectors() {
  const selectors = [
    '.jobs-description__content',
    '.jobs-description-content__text',
    '.description__text',
    '.job-description',
    '.posting',
    '[data-qa="job-description"]',
    '.job-description__content',
    'main article',
    'article',
    'main'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText && el.innerText.length > 400) {
      return cleanText(el.innerText);
    }
  }

  return '';
}

function extractJD() {
  const bySelector = extractFromSelectors();
  if (bySelector) return bySelector;
  return cleanText(document.body?.innerText || '');
}

function extractJobTitle() {
  const selectors = [
    '.jobs-unified-top-card__job-title',
    '.job-details-jobs-unified-top-card__job-title',
    '[data-test-id="job-title"]',
    'h1'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = cleanText(el?.innerText || el?.textContent || '');
    if (text && text.length > 2 && text.length < 120) {
      return text;
    }
  }

  const firstLine = cleanText(document.body?.innerText || '').split('\n').map((line) => line.trim()).find(Boolean) || '';
  return firstLine.length > 2 && firstLine.length < 120 ? firstLine : '';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractJD') {
    sendResponse({ jd: extractJD(), title: extractJobTitle() });
  }
  return true;
});
