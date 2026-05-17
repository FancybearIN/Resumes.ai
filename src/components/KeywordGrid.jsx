import React from 'react';

export default function KeywordGrid({ analysis }) {
  const matched = analysis?.matchedKeywords?.length ? analysis.matchedKeywords : analysis?.strongAreas || [];
  const missing = analysis?.missingKeywords || [];

  return (
    <section className="rounded-[24px] border border-slate-800/70 bg-slate-950/80 p-4 shadow-[0_24px_70px_rgba(3,6,20,0.38)] backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Keyword Insights</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-100">Matched and missing terms</h2>
        </div>
        <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[10px] font-medium text-slate-300">
          {matched.length + missing.length} total
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-emerald-400">
            <span>Matched</span>
            <span>{matched.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.length ? matched.map((item) => (
              <span key={item} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                {item}
              </span>
            )) : <span className="text-xs text-slate-500">No matched keywords yet.</span>}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-amber-400">
            <span>Missing</span>
            <span>{missing.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.length ? missing.map((item) => (
              <span key={item} className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-200">
                + {item}
              </span>
            )) : <span className="text-xs text-slate-500">No missing keywords yet.</span>}
          </div>
        </div>
      </div>
    </section>
  );
}