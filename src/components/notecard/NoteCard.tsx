import { Calendar, Tag, Trash2, Edit3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Note } from "../../types/note";
import styles from "./notecard.module.css";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  // Format the date (assuming note.updatedAt is a timestamp)
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className={cn(styles.card, styles[note.category.toLowerCase()])}>
      <div className={styles.header}>
        <span className={styles.categoryBadge}>
          <Tag size={12} />
          {note.category}
        </span>
        <div className={styles.actions}>
          <button onClick={() => onEdit?.(note.id)} className={styles.iconBtn}>
            <Link href={`/notes/edit/${note.id}`}>
              <Edit3 size={16} />
            </Link>
          </button>
          <button
            onClick={() => onDelete?.(note.id)}
            className={styles.iconBtnDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className={styles.title}>{note.title}</h3>
      <p className={styles.excerpt}>{note.content}</p>

      <div className={styles.footer}>
        <div className={styles.date}>
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
