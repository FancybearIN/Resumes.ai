import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const STEPS = [
  'Parsing resume',
  'Extracting JD requirements',
  'Matching ATS keywords',
  'Generating Gemini prompt'
];

export default function AnalysisLoadingCard() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((value) => (value + 1) % STEPS.length);
    }, 850);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[28px] border border-cyan-400/15 bg-slate-950/85 p-4 shadow-[0_28px_90px_rgba(3,6,20,0.5)] backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-slate-800 bg-slate-950">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-cyan-400/20 border-t-cyan-300"
          />
          <div className="relative z-10 text-center">
            <div className="text-2xl font-semibold text-cyan-200">...</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">AI</div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">Analyzing</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-100">Working through your resume and JD</h3>
            </div>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-medium text-cyan-200">
              Live
            </span>
          </div>

          <div className="space-y-2">
            {STEPS.map((step, index) => {
              const active = index === stepIndex;
              const complete = index < stepIndex;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition ${active ? 'border-cyan-400/25 bg-cyan-500/10 text-cyan-100' : 'border-slate-800 bg-slate-950/60 text-slate-400'}`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${complete ? 'bg-emerald-500/20 text-emerald-300' : active ? 'bg-cyan-400/20 text-cyan-200' : 'bg-slate-800 text-slate-500'}`}>
                    {complete ? '✓' : index + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                  {active ? <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.7)]" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}