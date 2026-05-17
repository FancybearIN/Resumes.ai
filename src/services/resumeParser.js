export function parseMarkdownResume(markdown) {
  const text = normalizeString(markdown).trim();
  const lower = text.toLowerCase();

  const section = (nameRegex) => {
    const re = new RegExp(`(^|\\n)#{1,3}\\s*${nameRegex}[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s|$)`, 'i');
    const m = text.match(re);
    return m ? m[2].trim() : '';
  };

  const listItems = (chunk) =>
    (chunk || '')
      .split('\n')
      .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
      .filter((line) => line.length > 0);

  const summary = section('summary|profile|objective');
  const skillsChunk = section('technical skills|skills');
  const experience = section('experience|work experience');
  const projects = section('projects');
  const certificationsChunk = section('certifications?|achievements?');

  return {
    summary,
    skills: listItems(skillsChunk),
    experience,
    projects,
    certifications: listItems(certificationsChunk),
    tools: keywordSlice(lower, ['burp', 'nmap', 'docker', 'kubernetes', 'git', 'linux', 'wireshark']),
    technologies: keywordSlice(lower, ['aws', 'azure', 'gcp', 'python', 'javascript', 'bash', 'api', 'owasp', 'sast', 'dast'])
  };
}

function keywordSlice(text, words) {
  return words.filter((w) => text.includes(w));
}

function normalizeString(value) {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  try {
    return String(value);
  } catch (_) {
    return '';
  }
}
