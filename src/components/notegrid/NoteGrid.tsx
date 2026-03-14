"use client";

import styles from "./notegrid.module.css";
import { Note } from "@/types/note";
import NoteCard from "../notecard/NoteCard";
import { useEffect, useOptimistic } from "react";
import { toast } from "sonner";

export default function NoteGrid({
  response,
}: {
  response: { success: boolean; data: Note[]; error?: string };
}) {
  const [optimisticNotes, removeOptimisticNote] = useOptimistic(
    response.data,
    (currentNotes, noteIdToRemove: string) =>
      currentNotes.filter((note) => note.id !== noteIdToRemove),
  );
  useEffect(() => {
    if (response.error) {
      toast.error(response.error);
    }
  }, [response.error]);
  return (
    <div className={styles.notesGrid}>
      {optimisticNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note as Note}
          onOptimisticDelete={removeOptimisticNote}
        />
      ))}
    </div>
  );
}
