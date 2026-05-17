import React from 'react';

export default function ResumeInput({ fileName, resumeSummary, parseStatus, onOpenEditor, onClear }) {
  return (
    <section className="rounded-[22px] border border-slate-800/70 bg-slate-950/80 p-3 shadow-[0_18px_48px_rgba(3,6,20,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Resume</p>
          {fileName ? (
            <>
              <h2 className="mt-1 truncate text-sm font-semibold text-slate-100">{fileName}</h2>
              <p className="mt-1 truncate text-xs text-slate-400">{resumeSummary || 'Ready for analysis'}</p>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-sm font-semibold text-slate-100">Upload or paste a resume</h2>
              <p className="mt-1 text-xs text-slate-400">Markdown resume stays local.</p>
            </>
          )}
        </div>

        <button
          className={`rounded-full border px-3 py-1 text-[10px] font-medium ${parseStatus ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200' : 'border-slate-700/70 bg-slate-900/80 text-slate-300'}`}
          type="button"
        >
          {parseStatus ? 'Ready' : 'Empty'}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="flex-1 border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-cyan-100 transition hover:bg-cyan-500/15" onClick={onOpenEditor} type="button">
          {fileName ? 'View Resume' : 'Add Resume'}
        </button>
        {fileName ? (
          <button className="border border-slate-800 bg-slate-900/85 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90" onClick={onOpenEditor} type="button">
            Replace
          </button>
        ) : null}
        {fileName && onClear ? (
          <button className="border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-200 transition hover:bg-rose-500/15" onClick={onClear} type="button">
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}
