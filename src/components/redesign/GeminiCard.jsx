import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

export function GeminiCard({ prompt, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      style={{
        margin: "0 16px 16px",
        borderRadius: 12,
        border: "1px solid rgba(139,92,246,0.2)",
        background: "rgba(139,92,246,0.04)",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(139,92,246,0.08)",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "10px 12px",
          background: "rgba(139,92,246,0.08)",
          borderBottom: "1px solid rgba(139,92,246,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(139,92,246,0.4)",
            }}
          >
            <Sparkles size={12} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>Gemini Rewrite Prompt</span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRegenerate}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#8888aa",
            }}
          >
            <RefreshCw size={11} strokeWidth={2} />
            <span style={{ fontSize: 10, fontWeight: 500 }}>Regen</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            style={{
              background: copied ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.2)",
              border: copied ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(139,92,246,0.3)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: copied ? "#10b981" : "#c4b5fd",
              transition: "all 0.2s",
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={11} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy size={11} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{copied ? "Copied!" : "Copy"}</span>
          </motion.button>
        </div>
      </div>

      {/* Prompt body */}
      <div
        style={{
          padding: "12px",
          fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: 11,
          lineHeight: 1.7,
          color: "#b8b8cc",
          maxHeight: 180,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {prompt ? prompt.split("\n").map((line, i) => {
          const isHeading = line.startsWith("You are") || line.startsWith("Key improvements");
          const isBullet = line.trim().startsWith("-");
          return (
            <div
              key={i}
              style={{
                color: isHeading ? "#e0d4ff" : isBullet ? "#9999cc" : "#b8b8cc",
                fontWeight: isHeading ? 600 : 400,
                marginBottom: isHeading ? 4 : 0,
              }}
            >
              {line || "​"}
            </div>
          );
        }) : (
          <div style={{ color: "#44446a", fontStyle: "italic" }}>No prompt generated yet.</div>
        )}
      </div>
    </motion.div>
  );
}
