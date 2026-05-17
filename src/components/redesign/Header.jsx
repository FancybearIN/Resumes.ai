import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Settings } from 'lucide-react';

const STATUS = {
  idle:           { label: "AI Ready",           color: "#10b981", pulse: false },
  "resume-ready": { label: "Resume Parsed",       color: "#4d8eff", pulse: false },
  "jd-ready":     { label: "JD Detected",         color: "#a78bfa", pulse: false },
  analyzing:      { label: "Analyzing…",          color: "#f59e0b", pulse: true  },
  results:        { label: "Analysis Complete",   color: "#10b981", pulse: false },
};

export function Header({ state, onOpenSettings }) {
  const s = STATUS[state] || STATUS.idle;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(130,130,255,0.08)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg, #4d8eff 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(77,142,255,0.35)",
          }}
        >
          <Shield size={16} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ color: "#e8e8f4", letterSpacing: "-0.01em", fontSize: 13, fontWeight: 600 }}>
            Resumes.ai
          </div>
          <div style={{ color: "#55557a", fontSize: 10, letterSpacing: "0.02em", marginTop: -1 }}>
            Powered by Gemini
          </div>
          <a
            href="https://www.linkedin.com/in/deepakparkash/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#7ab0ff", fontSize: 10, letterSpacing: "0.01em", marginTop: 2, textDecoration: "none" }}
          >
            Deepak Parkash on LinkedIn
          </a>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 20,
              background: `${s.color}18`,
              border: `1px solid ${s.color}30`,
            }}
          >
            <div style={{ position: "relative", width: 6, height: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: s.color,
                }}
              />
              {s.pulse && (
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: s.color,
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 11, color: s.color, fontWeight: 500, letterSpacing: "0.01em" }}>
              {s.label}
            </span>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={onOpenSettings}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#55557a",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#8888aa"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#55557a"}
        >
          <Settings size={15} />
        </button>
      </div>
    </div>
  );
}
