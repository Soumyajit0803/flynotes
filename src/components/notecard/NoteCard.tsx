"use client";

import { deleteNoteAction } from "@/lib/actions";
import DeleteModal from "../modals/DeleteModal";
import ViewNoteModal from "../modals/ViewNoteModal"; // New Modal
import { Calendar, Tag, Trash2, Edit3 } from "lucide-react";
import { Note } from "@/types/note";
import Link from "next/link";
import styles from "./notecard.module.css";
import { toast } from "sonner";
import { useState } from "react";

export default function NoteCard({ note }: { note: Note }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    const toastId = toast.loading("Deleting...");
    const result = await deleteNoteAction(note.id);
    if (result.success) {
      toast.success("Deleted", { id: toastId });
    } else {
      toast.error("Failed", { id: toastId });
    }
  };

  return (
    <>
      <div 
        className={`${styles.card} ${styles[note.category.toLowerCase()]}`}
        onClick={() => setIsViewModalOpen(true)} // Open full note on click
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.header}>
          <span className={styles.categoryBadge}>
            <Tag size={12} />
            {note.category}
          </span>

          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {/* stopPropagation prevents the View Modal from opening when clicking buttons */}
            <Link href={`/notes/edit/${note.id}`} className={styles.iconBtn}>
              <Edit3 size={16} />
            </Link>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
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
      </div>

      {/* Modals */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={note.title}
      />

      <ViewNoteModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        note={note}
      />
    </>
  );
}