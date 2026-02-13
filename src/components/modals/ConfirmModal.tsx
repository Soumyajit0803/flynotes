"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";
import { HelpCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  type: "create" | "update";
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, type }: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const config = {
    create: {
      header: "Create New Note?",
      body: `Ready to save "${title}"?`,
      btn: "Yes, Create",
      color: "var(--foreground)",
      backgroud: "var(--background)"
    },
    update: {
      header: "Save Changes?",
      body: `Do you want to update "${title}"?`,
      btn: "Yes, Update",
      color: "var(--foreground)",
      backgroud: "var(--background)"
    }
  };

  const current = config[type];

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <HelpCircle size={32} />
        </div>
        <h2>{current.header}</h2>
        <p>{current.body}</p>
        
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button 
            className={styles.confirmBtn} 
            onClick={onConfirm}
          >
            {current.btn}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}