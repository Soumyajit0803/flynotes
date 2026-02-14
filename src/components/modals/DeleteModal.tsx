"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Import this!
import styles from "./modal.module.css";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteModalProps) {
  const [mounted, setMounted] = useState(false);

  // 1. Handle Mounting (runs once when the component first appears)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // 2. Handle Scroll Lock (runs every time isOpen changes)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: ensure scroll is restored if the component is removed
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <AlertTriangle color="#ff4d4f" size={32} />
        </div>
        <h2>Delete Note?</h2>
        <p>
          Are you sure you want to delete <strong> &quot;{title}&quot; </strong>?
        </p>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body, // This sends the HTML to the very end of the <body> tag
  );
}
