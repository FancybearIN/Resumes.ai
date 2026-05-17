import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, CheckCircle2, X, Edit2 } from 'lucide-react';

export function ResumeSection({ fileName, onUpload, onClear, onOpenEditor }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        file.text().then(text => onUpload(text, file.name));
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        file.text().then(text => onUpload(text, file.name));
      }
    },
    [onUpload]
  );

  return (
    <div style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#55557a", textTransform: "uppercase" }}>
          Resume
        </span>
        {fileName && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10b981" }}
          >
            <CheckCircle2 size={12} />
            Ready
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!fileName ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "20px 16px",
              borderRadius: 10,
              border: dragging
                ? "1px dashed #4d8eff"
                : "1px dashed rgba(130,130,255,0.18)",
              background: dragging
                ? "rgba(77,142,255,0.06)"
                : "rgba(255,255,255,0.018)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: dragging ? "0 0 20px rgba(77,142,255,0.1)" : "none",
            }}
          >
            <input
              type="file"
              accept=".md,.txt,.pdf,.docx"
              style={{ display: "none" }}
              onChange={handleChange}
            />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(77,142,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(77,142,255,0.2)",
              }}
            >
              <Upload size={16} color="#4d8eff" strokeWidth={1.8} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#b8b8d0", fontWeight: 500 }}>
                Drop your resume here
              </div>
              <div style={{ fontSize: 11, color: "#44446a", marginTop: 2 }}>
                .md · .txt · .pdf · .docx
              </div>
            </div>
          </motion.label>
        ) : (
          <motion.div
            key="file-chip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.18)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                background: "rgba(16,185,129,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={15} color="#10b981" strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: "#e0e0f0", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {fileName}
              </div>
              <div style={{ fontSize: 10, color: "#10b981", marginTop: 1 }}>
                Parsed for analysis
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={onOpenEditor}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 4,
                  color: "#44446a",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={onClear}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  borderRadius: 4,
                  color: "#44446a",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
