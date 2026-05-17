import React from 'react';
import { motion } from 'motion/react';
import { User, Edit2 } from 'lucide-react';

export function CandidateContext({ summary, onOpenEditor }) {
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div
        onClick={onOpenEditor}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(130,130,255,0.08)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: "rgba(130,130,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User size={14} color="#8282ff" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "#55557a", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Candidate Context
          </div>
          <div style={{ fontSize: 12, color: "#8888aa", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {summary || "Advanced framing notes (optional)"}
          </div>
        </div>
        <div style={{ color: "#44446a" }}>
          <Edit2 size={14} />
        </div>
      </div>
    </div>
  );
}
