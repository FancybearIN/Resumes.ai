import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export function ModalShell({ title, subtitle, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(3,3,10,0.8)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#0a0a18",
          borderTop: "1px solid rgba(130,130,255,0.15)",
          borderLeft: "1px solid rgba(130,130,255,0.1)",
          borderRight: "1px solid rgba(130,130,255,0.1)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: "20px 16px 32px",
          boxShadow: "0 -20px 50px rgba(0,0,0,0.5)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, color: "#e0e0f0", fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: "#55557a", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#55557a",
            }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
