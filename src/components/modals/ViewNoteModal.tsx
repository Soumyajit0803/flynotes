import { Note } from "@/types/note";
import { X, Calendar, Tag } from "lucide-react";
import styles from "./viewmodal.module.css"; // Create this CSS file

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note;
}

export default function ViewNoteModal({ isOpen, onClose, note }: ViewNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
        
        <header className={styles.header}>
          <div className={styles.badge}>
            <Tag size={14} />
            {note.category}
          </div>
          <div className={styles.date}>
            <Calendar size={14} />
            {note.updatedAt.toLocaleDateString("en-IN")}
          </div>
        </header>

        <h2 className={styles.title}>{note.title}</h2>
        <div className={styles.content}>
          {note.content}
        </div>
      </div>
    </div>
  );
}