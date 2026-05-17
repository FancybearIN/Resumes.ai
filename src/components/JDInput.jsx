import React from 'react';

export default function JDInput({ jdTitle, jdStatus, onOpenEditor, onExtractJD }) {
  return (
    <section className="rounded-[22px] border border-slate-800/70 bg-slate-950/80 p-3 shadow-[0_18px_48px_rgba(3,6,20,0.35)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Job Description</p>
          {jdTitle ? (
            <>
              <h2 className="mt-1 truncate text-sm font-semibold text-slate-100">{jdTitle}</h2>
              <p className="mt-1 text-xs text-slate-400">{jdStatus || 'JD extracted and ready'}</p>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-sm font-semibold text-slate-100">Extract from current page</h2>
              <p className="mt-1 text-xs text-slate-400">Paste a JD only if extraction is unavailable.</p>
            </>
          )}
        </div>

        <button
          className={`rounded-full border px-3 py-1 text-[10px] font-medium ${jdTitle ? 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200' : 'border-slate-700/70 bg-slate-900/80 text-slate-300'}`}
          type="button"
        >
          {jdTitle ? 'Extracted' : 'Empty'}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="flex-1 border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-cyan-100 transition hover:bg-cyan-500/15" onClick={onExtractJD} type="button">
          Extract JD
        </button>
        <button className="border border-slate-800 bg-slate-900/85 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90" onClick={onOpenEditor} type="button">
          Edit
        </button>
      </div>
    </section>
  );
}
