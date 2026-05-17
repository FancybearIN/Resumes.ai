import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ChevronDown, Tag, Building2, Zap, Edit2 } from 'lucide-react';

export function JobSection({ jdData, onExtract, onOpenEditor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ padding: "0 16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#55557a", textTransform: "uppercase" }}>
          Job Description
        </span>
      </div>

      {/* Extract CTA */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={jdData ? undefined : onExtract}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: jdData ? "1px solid rgba(130,130,255,0.12)" : "1px solid rgba(77,142,255,0.3)",
          background: jdData
            ? "rgba(139,92,246,0.07)"
            : "linear-gradient(135deg, rgba(77,142,255,0.12) 0%, rgba(139,92,246,0.12) 100%)",
          cursor: jdData ? "default" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.2s",
          boxShadow: jdData ? "none" : "0 0 20px rgba(77,142,255,0.08)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: jdData
              ? "rgba(139,92,246,0.15)"
              : "rgba(77,142,255,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {jdData ? (
            <Building2 size={14} color="#a78bfa" strokeWidth={1.8} />
          ) : (
            <Globe size={14} color="#4d8eff" strokeWidth={1.8} />
          )}
        </div>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <div style={{ fontSize: 12, color: jdData ? "#a78bfa" : "#c8d8ff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {jdData ? jdData.role : "Extract JD From Current Page"}
          </div>
          <div style={{ fontSize: 10, color: jdData ? "#6655aa" : "#44446a", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {jdData ? jdData.company : "Auto-detect job posting"}
          </div>
        </div>
        {jdData && (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenEditor(); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 4,
                color: "#55557a",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 4,
                color: "#55557a",
                display: "flex",
                alignItems: "center",
              }}
            >
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
          </div>
        )}
      </motion.div>

      {/* Collapsible summary */}
      <AnimatePresence>
        {jdData && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                marginTop: 6,
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(130,130,255,0.08)",
                display: "flex",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Building2 size={11} color="#55557a" />
                <span style={{ fontSize: 11, color: "#8888aa" }}>{jdData.company}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Tag size={11} color="#55557a" />
                <span style={{ fontSize: 11, color: "#8888aa" }}>{jdData.keywordsCount || 0} keywords</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Zap size={11} color="#f59e0b" />
                <span style={{ fontSize: 11, color: "#f59e0b" }}>ATS-ready</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
