import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import AnalysisLoadingCard from './AnalysisLoadingCard';

export default function AnalysisPanel({ analysis, loading, onAnalyze, error }) {
  const [showDetails, setShowDetails] = useState(false);

  const score = Number(analysis?.atsScore || 0);
  const strength = analysis?.matchStrength || (score >= 85 ? 'Excellent' : score >= 75 ? 'Strong' : score >= 60 ? 'Moderate' : 'Weak');
  const color = scoreColor(score);
  const matched = useMemo(() => analysis?.matchedKeywords?.length ? analysis.matchedKeywords : analysis?.strongAreas || [], [analysis]);
  const missing = useMemo(() => analysis?.missingKeywords || [], [analysis]);

  if (loading) {
    return <AnalysisLoadingCard />;
  }

  return (
    <section className="rounded-[28px] border border-slate-800/70 bg-slate-950/85 p-4 shadow-[0_28px_90px_rgba(3,6,20,0.5)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/60">AI Analysis</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-100">Your resume match</h2>
        </div>
        <button className="rounded-full border border-slate-800 bg-slate-900/85 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90" onClick={onAnalyze} type="button">
          {analysis ? 'Refresh' : 'Run Analysis'}
        </button>
      </div>

      {analysis ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-[24px] border border-slate-800/70 bg-slate-950/70 p-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950" style={{ boxShadow: `0 0 0 1px ${color}16, 0 0 26px ${color}18` }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-transparent border-t-cyan-300/70 border-r-violet-300/60"
              />
              <div className="relative z-10 text-center" style={{ color }}>
                <div className="text-2xl font-semibold leading-none">{score}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">ATS</div>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Role Type</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{analysis.roleType}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Match Strength</p>
                <div className="mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: `${color}35`, backgroundColor: `${color}16`, color }}>
                  {strength}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  <span>ATS Progress</span>
                  <span>{score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400" style={{ width: `${score}%`, boxShadow: `0 0 12px ${color}60` }} />
                </div>
              </div>
            </div>
          </div>

          <ChipGroup title="Matched" count={matched.length} tone="emerald" items={matched} />
          <ChipGroup title="Missing" count={missing.length} tone="amber" items={missing} prefix="+ " />

          <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-800/70 bg-slate-950/70 p-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Focused output</p>
              <p className="mt-1 text-xs text-slate-400">Only the score, role type, and keyword chips are shown by default.</p>
            </div>
            {(analysis.addNow?.length || analysis.removeOrDeprioritize?.length || analysis.updateNow?.length) ? (
              <button className="rounded-full border border-slate-800 bg-slate-900/85 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90" type="button" onClick={() => setShowDetails((value) => !value)}>
                {showDetails ? 'Hide details' : 'More'}
              </button>
            ) : null}
          </div>

          {showDetails ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniList title="Add now" items={analysis.addNow} tone="cyan" />
              <MiniList title="Deprioritize" items={analysis.removeOrDeprioritize} tone="rose" />
              <MiniList title="Update first" items={analysis.updateNow} tone="violet" />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[24px] border border-dashed border-slate-800/80 bg-slate-950/60 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-2xl text-slate-500">
                0
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">ATS Score</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">Moderate Match</p>
                </div>
                <p className="text-xs text-slate-400">Load a resume and JD, then run the analysis.</p>
              </div>
            </div>
          </div>

          {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</p> : null}
        </div>
      )}
    </section>
  );
}

function scoreColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#f43f5e';
}

function ChipGroup({ title, count, tone, items, prefix = '' }) {
  const toneClass = tone === 'amber'
    ? 'border-amber-500/20 bg-amber-500/10 text-amber-200'
    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
        <span>{title}</span>
        <span>{count}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length ? items.map((item) => (
          <span key={item} className={`rounded-full border px-3 py-1 text-[11px] ${toneClass}`}>
            {prefix}{item}
          </span>
        )) : <span className="text-xs text-slate-500">None</span>}
      </div>
    </div>
  );
}

function MiniList({ title, items, tone }) {
  const toneClass = tone === 'rose'
    ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
    : tone === 'violet'
      ? 'border-violet-500/20 bg-violet-500/10 text-violet-200'
      : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100';

  return (
    <div className="rounded-[20px] border border-slate-800/70 bg-slate-950/70 p-4">
      <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-slate-500">{title}</div>
      <div className="space-y-2">
        {items?.length ? items.map((item) => (
          <div key={item} className={`rounded-2xl border px-2.5 py-2 text-xs ${toneClass}`}>
            {item}
          </div>
        )) : <div className="text-xs text-slate-500">None</div>}
      </div>
    </div>
  );
}