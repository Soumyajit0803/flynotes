"use client";

import { deleteNoteAction } from "@/lib/actions";
import DeleteModal from "../modals/DeleteModal";
import ViewNoteModal from "../modals/ViewNoteModal"; // New Modal
import { Calendar, Tag, Trash2, Edit3 } from "lucide-react";
import { Note } from "@/types/note";
import Link from "next/link";
import styles from "./notecard.module.css";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

export default function NoteCard({
  note,
  onOptimisticDelete,
}: {
  note: Note;
  onOptimisticDelete: (noteId: string) => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. Check if this note was returned from a semantic search
  const isSearchMatch = note.similarity !== undefined;
  const matchPercentage = isSearchMatch
    ? Math.round(note.similarity! * 100)
    : 0;
  console.log(matchPercentage)

  // The "Immediate Revert" Problem: The setter function returned by useOptimistic is designed to be active only while an asynchronous update is "pending". If you call it outside of a transition, React will update the UI for a fraction of a second and then immediately revert it back to the original state because there is no ongoing background task to "hold" the optimistic value.
  // useOptimistic cannot function without a Transition (or an Action) because of how React manages temporary states.

  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    const toastId = toast.loading("Deleting...");
    startTransition(async () => {
      // Anything inside this startTransition callback will be considered non-urgent and can be interrupted if the user starts another transition.

      // instant fake task
      onOptimisticDelete(note.id);

      // slow original task
      const result = await deleteNoteAction(note.id);
      if (result.success) {
        toast.success("Deleted", { id: toastId });
      } else {
        toast.error("Failed", { id: toastId });
      }
    });
  };

  return (
    <>
      <div
        className={`${styles.card} ${styles[note.category.toLowerCase()]}`}
        onClick={() => setIsViewModalOpen(true)} // Open full note on click
        style={{ cursor: "pointer" }}
      >
        <div className={styles.header}>
          <span className={styles.categoryBadge}>
            <Tag size={12} />
            {note.category}
          </span>

          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {/* stopPropagation prevents the View Modal from opening when clicking buttons */}
            <Link href={`/edit/${note.id}`} className={styles.iconBtn}>
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

        <h3 className={styles.title}>
          {note.title}{" "}
        </h3>
        {isSearchMatch && (
          <div className={styles.matchBadge}>
            <Sparkles size={12} className={styles.sparkleIcon} />
            <span>{matchPercentage}% Match</span>
          </div>
        )}
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
