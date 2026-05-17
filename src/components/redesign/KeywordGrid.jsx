import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function KeywordGrid({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{ margin: "0 16px 12px" }}
    >
      {/* Matched */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
          <CheckCircle2 size={12} color="#10b981" strokeWidth={2} />
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600, letterSpacing: "0.04em" }}>
            Matched ({result.matchedKeywords?.length || 0})
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {result.matchedKeywords?.map((kw, i) => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              style={{
                padding: "3px 9px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                color: "#34d399",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              {kw}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Missing */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
          <AlertCircle size={12} color="#f59e0b" strokeWidth={2} />
          <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, letterSpacing: "0.04em" }}>
            Missing ({result.missingKeywords?.length || 0})
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {result.missingKeywords?.map((kw, i) => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.15 + i * 0.05 }}
              style={{
                padding: "3px 9px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                color: "#fbbf24",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.22)",
              }}
            >
              + {kw}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
