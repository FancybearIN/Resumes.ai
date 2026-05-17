export function localAtsEstimate(jd, parsedResume) {
  const jdText = (jd || '').toLowerCase();
  const resumeText = [
    parsedResume.summary || '',
    (parsedResume.skills || []).join(' '),
    parsedResume.experience || '',
    parsedResume.projects || '',
    (parsedResume.certifications || []).join(' '),
    (parsedResume.tools || []).join(' '),
    (parsedResume.technologies || []).join(' ')
  ]
    .join(' ')
    .toLowerCase();

  const keywords = extractKeywords(jdText);
  const strongAreas = keywords.filter((k) => resumeText.includes(k)).slice(0, 8);
  const missingKeywords = keywords.filter((k) => !resumeText.includes(k)).slice(0, 12);
  const sectionSignals = countSectionSignals(parsedResume, jdText);
  const overlapRatio = strongAreas.length / Math.max(1, keywords.length);
  const weightedScore = Math.round((overlapRatio * 70) + (sectionSignals * 10) + 15);
  const score = Math.max(25, Math.min(95, weightedScore));

  const addNow = strongAreas.slice(0, 5);
  const removeOrDeprioritize = suggestDeprioritize(parsedResume, jdText);
  const updateNow = suggestUpdateTargets(parsedResume, jdText);
  const experiencePositioning = buildExperiencePositioning(parsedResume, jdText);
  const resumeFocus = buildResumeFocus(parsedResume, jdText, strongAreas, missingKeywords);
    const matchStrength = score >= 85 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : 'Weak';

  return {
    atsScore: score,
    roleType: inferRole(jdText),
    strongAreas,
    missingKeywords,
    addNow,
    removeOrDeprioritize,
    updateNow,
    experiencePositioning,
    resumeFocus,
    matchStrength
  };
}

function inferRole(text) {
  if (/application security|appsec|product security/.test(text)) return 'Application Security';
  if (/cloud security|aws|azure|kubernetes/.test(text)) return 'Cloud Security';
  if (/penetration|pentest|red team/.test(text)) return 'Pentest / Red Team';
  if (/soc|siem|detection|incident response/.test(text)) return 'SOC / Detection Engineering';
  return 'Security Engineer';
}

function extractKeywords(text) {
  const stop = new Set(['the', 'and', 'for', 'with', 'you', 'your', 'will', 'are', 'our', 'job', 'role', 'this']);
  const words = text
    .split(/[^a-z0-9+/.-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !stop.has(w));

  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 30);
}

function countSectionSignals(parsedResume, jdText) {
  const chunks = [
    parsedResume.summary,
    (parsedResume.skills || []).join(' '),
    parsedResume.experience,
    parsedResume.projects,
    (parsedResume.certifications || []).join(' ')
  ].join(' ').toLowerCase();

  const signals = ['security', 'api', 'cloud', 'aws', 'owasp', 'burp', 'sast', 'dast', 'python', 'automation'];
  return signals.reduce((acc, signal) => acc + Number(chunks.includes(signal) && jdText.includes(signal)), 0) / Math.max(1, signals.length);
}

function suggestDeprioritize(parsedResume, jdText) {
  const text = [parsedResume.summary, parsedResume.experience, parsedResume.projects].join(' ').toLowerCase();
  const generic = ['detail-oriented', 'team player', 'hardworking', 'motivated', 'passionate'];
  return generic.filter((item) => text.includes(item) && !jdText.includes(item)).slice(0, 5);
}

function suggestUpdateTargets(parsedResume, jdText) {
  const text = [parsedResume.summary, parsedResume.experience, (parsedResume.skills || []).join(' ')].join(' ').toLowerCase();
  const targets = [];
  if (text.includes('summary')) targets.push('Summary');
  if (text.includes('experience')) targets.push('Experience bullets');
  if (text.includes('skills')) targets.push('Skills section');
  if (text.includes('project')) targets.push('Projects section');
  if (jdText.includes('aws') && text.includes('cloud')) targets.push('Cloud/security wording');
  return [...new Set(targets)].slice(0, 5);
}

function buildExperiencePositioning(parsedResume, jdText) {
  const hasInternship = /intern|internship|trainee|apprentice/i.test([parsedResume.experience, parsedResume.projects].join(' '));
  if (hasInternship) {
    return 'Position as internship/early-career talent with hands-on security work, tools, projects, and practical execution. Avoid implying full-time ownership or senior leadership.';
  }
  if (/1-3 years|1 to 3 years|early-career/i.test(jdText)) {
    return 'Position as early-career cybersecurity talent with practical, hands-on examples and concise impact statements.';
  }
  return 'Position honestly based on the resume evidence; emphasize practical security execution, tools, and measurable results.';
}

function buildResumeFocus(parsedResume, jdText, strongAreas, missingKeywords) {
  const focus = [];
  if ((parsedResume.skills || []).length) focus.push('Skills section');
  if ((parsedResume.experience || '').trim()) focus.push('Experience bullets');
  if ((parsedResume.projects || '').trim()) focus.push('Projects section');
  if ((parsedResume.summary || '').trim()) focus.push('Summary');
  if (strongAreas.length) focus.push(`Emphasize: ${strongAreas.slice(0, 4).join(', ')}`);
  if (missingKeywords.length) focus.push(`Target only where truthful: ${missingKeywords.slice(0, 4).join(', ')}`);
  return [...new Set(focus)].slice(0, 6);
}
