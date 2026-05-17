const MODELS = {
  jdAnalysis: 'deepseek/deepseek-v4-flash:free',
  promptGen: 'qwen/qwen-2.5-72b-instruct:free',
  roleClass: 'mistralai/mistral-7b-instruct:free'
};

const MODEL_FALLBACKS = {
  jdAnalysis: [
    MODELS.jdAnalysis,
    'qwen/qwen-2.5-7b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free'
  ],
  promptGen: [
    MODELS.promptGen,
    'qwen/qwen-2.5-7b-instruct:free',
    'deepseek/deepseek-v4-flash:free',
    'meta-llama/llama-3.1-8b-instruct:free'
  ]
};

const MODEL_CACHE_TTL_MS = 5 * 60 * 1000;
let modelCache = { key: '', ts: 0, models: [] };

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeResume') {
    analyzeResume(request.payload).then(sendResponse).catch((err) => {
      sendResponse({ error: String(err) });
    });
    return true;
  }

  if (request.action === 'regeneratePrompt') {
    regeneratePrompt(request.payload).then(sendResponse).catch((err) => {
      sendResponse({ error: String(err) });
    });
    return true;
  }

  if (request.action === 'testApiKey') {
    testApiKey().then(sendResponse).catch((err) => {
      sendResponse({ ok: false, error: String(err) });
    });
    return true;
  }
});

async function getApiKey() {
  const data = await chrome.storage.local.get(['openrouterApiKey']);
  return (data.openrouterApiKey || '').trim();
}

async function callOpenRouter(model, messages, apiKey) {
  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, messages, temperature: 0.2 })
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`OpenRouter ${resp.status}: ${text}`);
  }

  const json = JSON.parse(text);
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No AI output returned');
  }
  return content;
}

function normalizeModelIds(modelsJson) {
  if (Array.isArray(modelsJson)) {
    return modelsJson.map((m) => m?.id || m?.name).filter(Boolean);
  }
  if (Array.isArray(modelsJson?.data)) {
    return modelsJson.data.map((m) => m?.id || m?.name).filter(Boolean);
  }
  if (Array.isArray(modelsJson?.models)) {
    return modelsJson.models.map((m) => m?.id || m?.name).filter(Boolean);
  }
  return [];
}

async function getAvailableModels(apiKey) {
  const now = Date.now();
  if (modelCache.key === apiKey && now - modelCache.ts < MODEL_CACHE_TTL_MS) {
    return modelCache.models;
  }

  const resp = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!resp.ok) return [];

  try {
    const json = await resp.json();
    const models = normalizeModelIds(json);
    modelCache = { key: apiKey, ts: now, models };
    return models;
  } catch (_) {
    return [];
  }
}

async function callWithFallback(candidates, messages, apiKey) {
  const available = await getAvailableModels(apiKey);

  // Prefer user/account-available models first
  const ordered = [];
  const seen = new Set();

  const add = (id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    ordered.push(id);
  };

  for (const id of candidates) {
    if (available.length === 0 || available.includes(id)) add(id);
  }

  // If none matched, try first available free models as emergency fallback
  if (ordered.length === 0 && available.length > 0) {
    available.filter((id) => id.endsWith(':free')).slice(0, 4).forEach(add);
  }

  if (ordered.length === 0) {
    throw new Error('No compatible OpenRouter models available for this API key.');
  }

  let lastError = null;
  for (const model of ordered) {
    try {
      const content = await callOpenRouter(model, messages, apiKey);
      return { model, content };
    } catch (err) {
      lastError = err;
      const msg = String(err || '').toLowerCase();
      // Continue on model-specific issues; stop on non-model transport errors
      if (!(msg.includes('404') || msg.includes('no endpoints found') || msg.includes('model'))) {
        throw err;
      }
    }
  }

  throw lastError || new Error('All candidate models failed.');
}

function safeJsonParseFromText(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error('Failed to parse analysis JSON');
  }
}

function buildAnalysisSystemPrompt() {
  return [
    'You are a fast and accurate cybersecurity resume matching assistant.',
    'Compare JOB_DESCRIPTION with MARKDOWN_RESUME.',
    'Use CANDIDATE_CONTEXT if present to interpret seniority, internship-only status, salary notes, and job-research notes truthfully.',
    'Return strict JSON only with keys:',
    'atsScore (number 0-100), roleType (string), strongAreas (string[]), missingKeywords (string[]), addNow (string[]), removeOrDeprioritize (string[]), updateNow (string[]), experiencePositioning (string), resumeFocus (string[]), geminiPrompt (string).',
    'Rules:',
    '- Be truthful and conservative.',
    '- Do not invent skills/experience/certifications/projects.',
    '- Focus on cybersecurity relevance.',
    '- addNow: high impact keywords/topics to add if genuinely present in user background.',
    '- removeOrDeprioritize: content to reduce because less relevant for this JD.',
    '- updateNow: bullets/sections to rewrite first for best ATS improvement.',
    '- experiencePositioning: explain how to frame internship-only or limited experience without claiming full-time work.',
    '- resumeFocus: short list of the sections or proof points the resume should emphasize for this JD.',
    '- geminiPrompt: a complete high-quality Gemini prompt that rewrites existing resume only.'
  ].join('\n');
}

function buildPromptSystemPrompt() {
  return [
    'You create high-quality Gemini rewrite prompts for cybersecurity resumes.',
    'Output plain text prompt only.',
    'Prompt must enforce:',
    '- do not invent experience/certs/projects',
    '- rewrite existing bullets only',
    '- preserve one-page resume style',
    '- optimize ATS keyword alignment naturally',
    '- maintain concise professional cybersecurity tone'
  ].join('\n');
}

async function analyzeResume(payload) {
  const apiKey = await getApiKey();
  if (!apiKey) return { error: 'OpenRouter API key not saved.' };

  const jd = (payload?.jd || '').trim();
  const resumeMarkdown = (payload?.resumeMarkdown || '').trim();
  const candidateContext = (payload?.candidateContext || '').trim();
  if (!jd) return { error: 'Job description is required.' };
  if (!resumeMarkdown) return { error: 'Markdown resume is required.' };

  const analysisResult = await callWithFallback(
    MODEL_FALLBACKS.jdAnalysis,
    [
      { role: 'system', content: buildAnalysisSystemPrompt() },
      {
        role: 'user',
        content: `JOB_DESCRIPTION:\n${jd}\n\nMARKDOWN_RESUME:\n${resumeMarkdown}`
          + (candidateContext ? `\n\nCANDIDATE_CONTEXT:\n${candidateContext}` : '')
      }
    ],
    apiKey
  );
  const analysisText = analysisResult.content;

  let analysis;
  try {
    analysis = normalizeAnalysis(safeJsonParseFromText(analysisText));
  } catch (e) {
    return { error: 'AI analysis parsing failed. Try again.', raw: analysisText };
  }

  // Fast path: prompt is generated in the same AI call to reduce latency.
  const prompt = analysis.geminiPrompt || '';

  return { analysis, prompt, modelsUsed: { analysis: analysisResult.model } };
}

async function regeneratePrompt(payload) {
  const apiKey = await getApiKey();
  if (!apiKey) return { error: 'OpenRouter API key not saved.' };
  const jd = (payload?.jd || '').trim();
  const resumeMarkdown = (payload?.resumeMarkdown || '').trim();
  const analysis = payload?.analysis || null;
  const candidateContext = (payload?.candidateContext || '').trim();

  if (!jd || !resumeMarkdown || !analysis) {
    return { error: 'JD, resume, and analysis are required to regenerate prompt.' };
  }

  const prompt = await generateGeminiPrompt({ jd, resumeMarkdown, analysis, candidateContext, apiKey });
  return { prompt };
}

async function generateGeminiPrompt({ jd, resumeMarkdown, analysis, candidateContext, apiKey }) {
  const promptResult = await callWithFallback(
    MODEL_FALLBACKS.promptGen,
    [
      { role: 'system', content: buildPromptSystemPrompt() },
      {
        role: 'user',
        content: [
          'Create a Gemini prompt for resume rewriting.',
          `Role type: ${analysis.roleType || 'Cybersecurity role'}`,
          `ATS score: ${analysis.atsScore ?? 'N/A'}`,
          `Strong areas: ${(analysis.strongAreas || []).join(', ')}`,
          `Missing keywords: ${(analysis.missingKeywords || []).join(', ')}`,
          `Experience positioning: ${analysis.experiencePositioning || ''}`,
          `Resume focus: ${(analysis.resumeFocus || []).join(', ')}`,
          candidateContext ? 'Use the candidate context for truthful framing only; do not insert it as resume content.' : '',
          candidateContext ? `Candidate context: ${candidateContext}` : '',
          'Job description:',
          jd,
          'Current markdown resume:',
          resumeMarkdown,
          'The Gemini prompt must instruct rewriting only existing content and never invent facts.'
        ].join('\n\n')
      }
    ],
    apiKey
  );
  return promptResult.content;
}

function normalizeAnalysis(raw) {
  const obj = raw && typeof raw === 'object' ? raw : {};
  const toList = (v) => (Array.isArray(v) ? v.filter(Boolean).map((x) => String(x)) : []);
  const toText = (v) => (v == null ? '' : String(v));
  const scoreNum = Number(obj.atsScore);
  const atsScore = Number.isFinite(scoreNum) ? Math.max(0, Math.min(100, Math.round(scoreNum))) : 0;

  const deriveStrength = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Strong';
    if (score >= 60) return 'Moderate';
    return 'Weak';
  };

  return {
    atsScore,
    roleType: toText(obj.roleType) || 'Security Engineer',
    strongAreas: toList(obj.strongAreas),
    missingKeywords: toList(obj.missingKeywords),
    addNow: toList(obj.addNow),
    removeOrDeprioritize: toList(obj.removeOrDeprioritize),
    updateNow: toList(obj.updateNow),
    experiencePositioning: toText(obj.experiencePositioning),
    resumeFocus: toList(obj.resumeFocus),
    geminiPrompt: toText(obj.geminiPrompt),
    matchStrength: toText(obj.matchStrength) || deriveStrength(atsScore),
    matchedKeywords: toList(obj.matchedKeywords).length ? toList(obj.matchedKeywords) : toList(obj.strongAreas),
    company: toText(obj.company)
  };
}

async function testApiKey() {
  const apiKey = await getApiKey();
  if (!apiKey) return { ok: false, error: 'No key saved.' };

  const resp = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  if (!resp.ok) {
    const text = await resp.text();
    return { ok: false, error: `OpenRouter ${resp.status}: ${text}` };
  }

  let modelCount = 0;
  try {
    const json = await resp.json();
    modelCount = normalizeModelIds(json).length;
  } catch (_) {
    modelCount = 0;
  }

  return { ok: true, modelCount };
}
