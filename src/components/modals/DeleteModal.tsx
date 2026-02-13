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

  // Portals need to wait until the component is "mounted" on the client
  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      // Disable scrolling on the body when modal opens
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable scrolling when modal closes or unmounts
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
          Are you sure you want to delete <strong>"{title}"</strong>?
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
