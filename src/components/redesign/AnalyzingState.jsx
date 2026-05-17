import React from 'react';
import { motion } from 'motion/react';

const STEPS = [
  "Parsing resume structure…",
  "Extracting JD requirements…",
  "Running ATS keyword match…",
  "Scoring semantic alignment…",
  "Generating Gemini prompt…",
];

export function AnalyzingState() {
  return (
    <div
      style={{
        margin: "0 16px 16px",
        padding: "20px 16px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(130,130,255,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Orbiting orbs */}
      <div style={{ position: "relative", width: 56, height: 56 }}>
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            inset: "50%",
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4d8eff, #8b5cf6)",
            boxShadow: "0 0 12px rgba(139,92,246,0.6)",
          }}
        />
        {/* Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(77,142,255,0.2)",
          }}
        />
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -3,
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#4d8eff",
              boxShadow: "0 0 8px #4d8eff",
            }}
          />
        </motion.div>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: "1px dashed rgba(139,92,246,0.15)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
          style={{ position: "absolute", inset: -8, borderRadius: "50%" }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: "translateX(-50%)",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 6px #a78bfa",
            }}
          />
        </motion.div>
      </div>

      {/* Cycling steps */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.35, duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 7,
              background: i === STEPS.length - 1 ? "rgba(77,142,255,0.06)" : "transparent",
            }}
          >
            {/* Step indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.35 + 0.1, type: "spring", stiffness: 300 }}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: i === STEPS.length - 1 ? "#4d8eff" : "#2a2a4a",
                boxShadow: i === STEPS.length - 1 ? "0 0 6px #4d8eff80" : "none",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: i === STEPS.length - 1 ? "#8888cc" : "#333355",
              }}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Shimmer bar */}
      <div style={{ width: "100%", height: 3, borderRadius: 3, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{
            height: "100%",
            width: "50%",
            background: "linear-gradient(90deg, transparent, rgba(77,142,255,0.5), transparent)",
          }}
        />
      </div>
    </div>
  );
}
