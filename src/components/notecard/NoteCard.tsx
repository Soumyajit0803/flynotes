"use client";

import { deleteNoteAction } from "@/lib/actions";
import DeleteModal from "../modals/DeleteModal";
import { Calendar, Tag, Trash2, Edit3 } from "lucide-react";
import { Note } from "@/types/note";
import Link from "next/link";
import styles from "./notecard.module.css";
import { toast } from "sonner";
import { useState } from "react";

export default function NoteCard({ note }: { note: Note }) {
  // Format the date (assuming note.updatedAt is a timestamp)
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsModalOpen(false); // Close modal
    const toastId = toast.loading("Deleting...");

    const result = await deleteNoteAction(note.id);
    if (result.success) {
      toast.success("Deleted", { id: toastId });
    } else {
      toast.error("Failed", { id: toastId });
    }
  };

  return (
    <div className={`${styles.card} ${styles[note.category.toLowerCase()]}`}>
      <div className={styles.header}>
        <span className={styles.categoryBadge}>
          <Tag size={12} />
          {note.category}
        </span>

        <div className={styles.actions}>
          {/* EDIT: Direct link to the dynamic route we set up earlier */}
          <Link href={`/notes/edit/${note.id}`} className={styles.iconBtn}>
            <Edit3 size={16} />
          </Link>

          {/* DELETE: Connected to our handleDelete function */}
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
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
          <span>
            {note.updatedAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={note.title}
        />
    </div>
  );
}
