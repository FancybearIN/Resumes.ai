import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Cpu, ChevronRight, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';

// Redesigned components
import { Header } from './components/redesign/Header';
import { ResumeSection } from './components/redesign/ResumeSection';
import { JobSection } from './components/redesign/JobSection';
import { AnalysisCard } from './components/redesign/AnalysisCard';
import { KeywordGrid } from './components/redesign/KeywordGrid';
import { GeminiCard } from './components/redesign/GeminiCard';
import { AnalyzingState } from './components/redesign/AnalyzingState';
import { CandidateContext } from './components/redesign/CandidateContext';
import { ModalShell } from './components/redesign/ModalShell';

// Services
import { parseMarkdownResume } from './services/resumeParser';
import { localAtsEstimate } from './services/atsAnalyzer';
import { buildFallbackGeminiPrompt } from './services/promptGenerator';
import { analyzeWithOpenRouter, regeneratePromptWithOpenRouter, testApiKeyWithOpenRouter } from './services/openrouter';
import { extractJDFromCurrentPage } from './services/jdExtractor';

const DIVIDER = (
  <div
    style={{
      margin: "0 16px",
      height: 1,
      background: "rgba(130,130,255,0.06)",
    }}
  />
);

export default function App() {
  // State
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState('');
  const [resumeMarkdown, setResumeMarkdown] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [candidateContext, setCandidateContext] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdSourceTitle, setJdSourceTitle] = useState('');
  const [jdSourceUrl, setJdSourceUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'resume' | 'jd' | 'context'
  
  const autoRunSignatureRef = useRef('');

  // Derived state
  const appState = useMemo(() => {
    if (loading) return 'analyzing';
    if (analysis) return 'results';
    if (jdText) return 'jd-ready';
    if (resumeMarkdown) return 'resume-ready';
    return 'idle';
  }, [loading, analysis, jdText, resumeMarkdown]);

  const parsedResume = useMemo(() => {
    try {
      return parseMarkdownResume(resumeMarkdown);
    } catch (_) {
      return { skills: [], summary: '' };
    }
  }, [resumeMarkdown]);

  const jdData = useMemo(() => {
    if (!jdText) return null;
    return {
      role: jdSourceTitle || deriveRoleFromJd(jdText),
      company: deriveCompanyFromJd(jdText),
      keywordsCount: 0 // Will be updated by analysis
    };
  }, [jdText, jdSourceTitle]);

  const candidateSummary = useMemo(() => {
    if (!candidateContext) return '';
    const firstLine = candidateContext.split('\n').find(Boolean) || '';
    return firstLine.length > 40 ? firstLine.slice(0, 40) + '...' : firstLine;
  }, [candidateContext]);

  // Effects
  useEffect(() => {
    chrome.storage.local.get(['openrouterApiKey', 'resumeMarkdown', 'resumeFileName', 'jdText', 'jdSourceTitle', 'jdSourceUrl', 'candidateContext'], async (data) => {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentUrl = activeTab?.url || '';

      if (data.openrouterApiKey) setApiKey(data.openrouterApiKey);
      if (data.resumeMarkdown) setResumeMarkdown(data.resumeMarkdown);
      if (data.resumeFileName) setResumeFileName(data.resumeFileName);
      if (data.jdText && data.jdSourceUrl && data.jdSourceUrl === currentUrl) {
        setJdText(data.jdText);
        setJdSourceTitle(data.jdSourceTitle || '');
        setJdSourceUrl(data.jdSourceUrl);
      }
      if (data.candidateContext) setCandidateContext(data.candidateContext);
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ resumeMarkdown, resumeFileName, jdText, jdSourceTitle, jdSourceUrl, candidateContext });
  }, [resumeMarkdown, resumeFileName, jdText, jdSourceTitle, jdSourceUrl, candidateContext]);

  // Auto-run analysis
  useEffect(() => {
    if (!jdText || !resumeMarkdown || !apiKey || loading) return;
    const signature = `${jdText.slice(0, 100)}::${resumeMarkdown.slice(0, 100)}::${candidateContext.slice(0, 50)}`;
    if (autoRunSignatureRef.current === signature) return;

    const timeoutId = setTimeout(() => {
      autoRunSignatureRef.current = signature;
      handleAnalyze(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [jdText, resumeMarkdown, candidateContext, apiKey, loading]);

  // Handlers
  const handleAnalyze = async (autoRun = false) => {
    if (!apiKey) {
      if (!autoRun) setActiveModal('settings');
      return;
    }
    if (!resumeMarkdown || !jdText) return;

    setLoading(true);
    setError('');

    try {
      const ai = await analyzeWithOpenRouter({ jd: jdText, resumeMarkdown, parsedResume, candidateContext });
      
      if (ai.error) {
        const fallbackAnalysis = localAtsEstimate(jdText, parsedResume);
        const fallbackPrompt = buildFallbackGeminiPrompt({ jd: jdText, resumeMarkdown, analysis: fallbackAnalysis, candidateContext });
        setAnalysis(fallbackAnalysis);
        setPrompt(fallbackPrompt);
        if (!autoRun) setError(`AI error: ${ai.error}. Showing local fallback.`);
      } else {
        setAnalysis(ai.analysis);
        setPrompt(ai.prompt || '');
      }
    } catch (err) {
      setError('Analysis failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleExtractJD = async () => {
    setLoading(true);
    const result = await extractJDFromCurrentPage();
    if (result.error) {
      setError(`Extraction failed: ${result.error}`);
    } else {
      setJdText(result.jd || '');
      setJdSourceTitle(result.title || '');
      setJdSourceUrl(result.sourceUrl || '');
      setAnalysis(null);
      setPrompt('');
    }
    setLoading(false);
  };

  const handleRegenerate = async () => {
    if (!analysis) return;
    setLoading(true);
    const result = await regeneratePromptWithOpenRouter({ jd: jdText, resumeMarkdown, analysis, candidateContext });
    if (!result.error) {
      setPrompt(result.prompt || '');
    }
    setLoading(false);
  };

  const onSaveApiKey = () => {
    chrome.storage.local.set({ openrouterApiKey: apiKey.trim() }, () => {
      setKeyStatus('Saved!');
      setTimeout(() => setKeyStatus(''), 2000);
    });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "0",
        background: "#060610",
      }}
    >
      <div
        style={{
          width: 440,
          borderRadius: 0,
          background: "#0a0a18",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header state={appState} onOpenSettings={() => setActiveModal('settings')} />

        <div style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 40 }}>
          {/* Resume */}
          <ResumeSection
            fileName={resumeFileName}
            onUpload={(text, name) => {
              setResumeMarkdown(text);
              setResumeFileName(name);
              setAnalysis(null);
            }}
            onClear={() => {
              setResumeMarkdown('');
              setResumeFileName('');
              setAnalysis(null);
              setPrompt('');
            }}
            onOpenEditor={() => setActiveModal('resume')}
          />

          {DIVIDER}

          {/* Job Description */}
          <JobSection 
            jdData={jdData} 
            onExtract={handleExtractJD} 
            onOpenEditor={() => setActiveModal('jd')}
          />

          {/* Candidate Context (Compact) */}
          <CandidateContext 
            summary={candidateSummary} 
            onOpenEditor={() => setActiveModal('context')} 
          />

          {/* Analyze button (only if not results and ready) */}
          <AnimatePresence>
            {appState !== 'results' && appState !== 'analyzing' && resumeMarkdown && jdText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ padding: "0 16px 12px" }}
              >
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(77,142,255,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnalyze()}
                  style={{
                    width: "100%",
                    padding: "11px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(77,142,255,0.35)",
                    background: "linear-gradient(135deg, rgba(77,142,255,0.18) 0%, rgba(139,92,246,0.18) 100%)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 0 20px rgba(77,142,255,0.12)",
                  }}
                >
                  <Cpu size={15} color="#7ab0ff" strokeWidth={1.8} />
                  <span style={{ fontSize: 13, color: "#c8d8ff", fontWeight: 600, letterSpacing: "-0.01em" }}>
                    Run Analysis
                  </span>
                  <ChevronRight size={14} color="#4d8eff" strokeWidth={2} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing state */}
          <AnimatePresence>
            {appState === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {DIVIDER}
                <div style={{ height: 12 }} />
                <AnalyzingState />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {appState === "results" && analysis && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {DIVIDER}
                <div style={{ height: 12 }} />

                {/* ATS Score */}
                <div style={{ padding: "0 0 4px" }}>
                  <div style={{ padding: "0 16px 6px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#55557a", textTransform: "uppercase" }}>
                      ATS Analysis
                    </span>
                  </div>
                  <AnalysisCard result={{
                    ...analysis,
                    role: jdData?.role || 'Security Role',
                    company: jdData?.company || 'Target Company'
                  }} />
                </div>

                {/* Keywords */}
                <div style={{ padding: "0 0 4px" }}>
                  <div style={{ padding: "0 16px 6px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#55557a", textTransform: "uppercase" }}>
                      Keyword Insights
                    </span>
                  </div>
                  <KeywordGrid result={analysis} />
                </div>

                {DIVIDER}
                <div style={{ height: 12 }} />

                {/* Gemini prompt */}
                <div>
                  <div style={{ padding: "0 16px 8px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#55557a", textTransform: "uppercase" }}>
                      AI Rewrite Artifact
                    </span>
                  </div>
                  <GeminiCard prompt={prompt} onRegenerate={handleRegenerate} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ 
                padding: "10px 12px", 
                borderRadius: 10, 
                background: "rgba(239,68,68,0.1)", 
                border: "1px solid rgba(239,68,68,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#ef4444",
                fontSize: 12
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Modal Overlays */}
        <AnimatePresence>
          {activeModal === 'settings' && (
            <ModalShell 
              title="API Settings" 
              subtitle="Use OpenRouter to power the analysis."
              onClose={() => setActiveModal(null)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#55557a", marginBottom: 6, display: "block" }}>OpenRouter API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10,
                      padding: "10px 12px",
                      color: "#fff",
                      fontSize: 13,
                      outline: "none"
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button 
                    onClick={onSaveApiKey}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      background: "#4d8eff",
                      color: "#fff",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {keyStatus || "Save Configuration"}
                  </button>
                  <button 
                    onClick={async () => {
                      setKeyStatus('Testing...');
                      const res = await testApiKeyWithOpenRouter();
                      setKeyStatus(res.ok ? 'Works!' : 'Failed');
                      setTimeout(() => setKeyStatus(''), 2000);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.05)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: 13,
                      cursor: "pointer"
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>
            </ModalShell>
          )}

          {activeModal === 'resume' && (
            <ModalShell 
              title="Resume Editor" 
              subtitle="Edit or paste your markdown resume."
              onClose={() => setActiveModal(null)}
            >
              <textarea 
                value={resumeMarkdown}
                onChange={(e) => setResumeMarkdown(e.target.value)}
                style={{
                  width: "100%",
                  height: 350,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#b8b8cc",
                  fontSize: 13,
                  fontFamily: "monospace",
                  outline: "none",
                  resize: "none"
                }}
              />
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "#e0e0f0",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Close Editor
              </button>
            </ModalShell>
          )}

          {activeModal === 'jd' && (
            <ModalShell 
              title="Job Description" 
              subtitle="Paste or verify the extracted job description."
              onClose={() => setActiveModal(null)}
            >
              <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                style={{
                  width: "100%",
                  height: 350,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#b8b8cc",
                  fontSize: 13,
                  outline: "none",
                  resize: "none"
                }}
              />
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "#e0e0f0",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Done
              </button>
            </ModalShell>
          )}

          {activeModal === 'context' && (
            <ModalShell 
              title="Candidate Context" 
              subtitle="Advanced: Add specific framing for this application."
              onClose={() => setActiveModal(null)}
            >
              <textarea 
                value={candidateContext}
                onChange={(e) => setCandidateContext(e.target.value)}
                placeholder="Example: focus on AppSec, highlight internship experience, etc."
                style={{
                  width: "100%",
                  height: 200,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "12px",
                  color: "#b8b8cc",
                  fontSize: 13,
                  outline: "none",
                  resize: "none"
                }}
              />
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.05)",
                  color: "#e0e0f0",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Save Context
              </button>
            </ModalShell>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helpers
function deriveRoleFromJd(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines[0] || 'Security Engineer';
}

function deriveCompanyFromJd(text) {
  // Simple heuristic: look for "at [Company]" or just the first line if it's short
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 1 && lines[1].length < 30) return lines[1];
  return 'Company';
}
