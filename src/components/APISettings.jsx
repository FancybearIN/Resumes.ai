import React from 'react';

export default function APISettings({ apiKey, setApiKey, onSave, onRemove, onTest, keyStatus }) {
  return (
    <section className="rounded-[24px] border border-slate-800/70 bg-slate-950/80 p-4 shadow-[0_24px_70px_rgba(3,6,20,0.42)] backdrop-blur-xl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">1. API Settings</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-100">OpenRouter key</h2>
        </div>
        <span className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[10px] font-medium text-slate-300">
          Local only
        </span>
      </div>

      <input
        type="password"
        placeholder="OpenRouter API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="flex-1 min-w-[92px] bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-2 text-slate-950 shadow-[0_0_22px_rgba(56,189,248,0.22)] transition hover:brightness-110" onClick={onSave}>Save</button>
        <button className="flex-1 min-w-[92px] border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200 transition hover:bg-slate-800/90" onClick={onTest}>Test</button>
        <button className="flex-1 min-w-[92px] border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-200 transition hover:bg-rose-500/15" onClick={onRemove}>Remove</button>
      </div>

      {keyStatus ? <p className="mt-3 text-xs text-slate-300">{keyStatus}</p> : null}
    </section>
  );
}
