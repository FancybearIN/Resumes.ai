import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Briefcase } from 'lucide-react';

const RADIUS = 38;
const CIRC = 2 * Math.PI * RADIUS;

function scoreColor(score) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function strengthBadge(s) {
  const map = {
    Weak:      { bg: "rgba(239,68,68,0.12)",   text: "#ef4444" },
    Moderate:  { bg: "rgba(245,158,11,0.12)",  text: "#f59e0b" },
    Strong:    { bg: "rgba(77,142,255,0.12)",  text: "#4d8eff" },
    Excellent: { bg: "rgba(16,185,129,0.12)",  text: "#10b981" },
  };
  return map[s] || map["Moderate"];
}

export function AnalysisCard({ result }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimScore(result.atsScore), 80);
    return () => clearTimeout(t);
  }, [result.atsScore]);

  const progress = (animScore / 100) * CIRC;
  const color = scoreColor(result.atsScore);
  const badge = strengthBadge(result.matchStrength);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        margin: "0 16px 12px",
        padding: "14px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(130,130,255,0.1)",
        boxShadow: `0 0 30px ${color}18`,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {/* Circular score */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="88" height="88" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="48" cy="48" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
            <circle
              cx="48" cy="48" r={RADIUS} fill="none"
              stroke={color} strokeWidth="7"
              strokeDasharray={`${progress} ${CIRC}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1.1s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{animScore}</span>
            <span style={{ fontSize: 9, color: "#55557a", letterSpacing: "0.06em", marginTop: 2 }}>ATS SCORE</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: "#44446a", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Role</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Briefcase size={12} color="#8888aa" strokeWidth={1.8} />
              <span style={{ fontSize: 12, color: "#c8c8e0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{result.role}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#44446a", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Match Strength</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 8px",
                borderRadius: 20,
                background: badge.bg,
              }}
            >
              <Target size={11} color={badge.text} strokeWidth={2} />
              <span style={{ fontSize: 11, color: badge.text, fontWeight: 600 }}>{result.matchStrength}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10, color: "#44446a", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>ATS Progress</div>
            <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${animScore}%` }}
                transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${color}88, ${color})`,
                  boxShadow: `0 0 8px ${color}60`,
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ fontSize: 9, color: "#333355" }}>0</span>
              <span style={{ fontSize: 9, color: "#333355" }}>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company row */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 10,
          borderTop: "1px solid rgba(130,130,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <TrendingUp size={12} color="#55557a" strokeWidth={1.8} />
        <span style={{ fontSize: 11, color: "#55557a" }}>
          Matched against <span style={{ color: "#8888aa" }}>{result.company}</span> posting
          &nbsp;·&nbsp;
          <span style={{ color: "#4d8eff" }}>{result.matchedKeywords?.length || 0} matched</span>
          &nbsp;·&nbsp;
          <span style={{ color: "#ef4444" }}>{result.missingKeywords?.length || 0} missing</span>
        </span>
      </div>
    </motion.div>
  );
}
