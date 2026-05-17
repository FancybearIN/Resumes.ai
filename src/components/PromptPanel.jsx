import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function PromptPanel({ prompt, onCopy, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="rounded-[28px] border border-violet-500/18 bg-gradient-to-b from-violet-500/8 to-slate-950/85 p-4 shadow-[0_28px_90px_rgba(3,6,20,0.5)] backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">Gemini Artifact</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-100">Rewrite prompt</h2>
          <p className="mt-1 text-xs text-slate-400">Copy this into Gemini to rewrite the existing resume truthfully.</p>
        </div>

        <div className="flex gap-2">
          <button className="rounded-full border border-slate-800 bg-slate-900/85 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90 disabled:cursor-not-allowed disabled:opacity-60" onClick={onRegenerate} disabled={loading || !prompt} type="button">
            {loading ? 'Regen...' : 'Regen'}
          </button>
          <button className="rounded-full border border-violet-400/25 bg-violet-500/15 px-3 py-2 text-violet-100 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60" onClick={handleCopy} disabled={!prompt} type="button">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-slate-800/70 bg-[#081018] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-violet-500/10 to-transparent" />

        <div className="absolute right-3 top-3">
          <button className="rounded-full border border-violet-400/20 bg-violet-500/15 px-3 py-1 text-[10px] font-medium text-violet-100 shadow-[0_0_16px_rgba(168,85,247,0.16)] transition hover:bg-violet-500/20" onClick={handleCopy} disabled={!prompt} type="button">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="max-h-64 overflow-auto pr-16 font-mono text-[11px] leading-6 text-slate-300">
          {prompt ? prompt.split('\n').map((line, index) => (
            <div key={`${index}-${line}`} className={line.trim().startsWith('-') ? 'text-slate-400' : index === 0 ? 'text-violet-100' : 'text-slate-300'}>
              {line || ' '}
            </div>
          )) : (
            <div className="flex min-h-36 items-center text-slate-500">
              Prompt will appear after analysis.
            </div>
          )}
        </div>
      </div>

      {prompt ? (
        <AnimatePresence>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-xs text-slate-400"
          >
            Premium generated output ready to copy.
          </motion.p>
        </AnimatePresence>
      ) : null}
    </section>
  );
}