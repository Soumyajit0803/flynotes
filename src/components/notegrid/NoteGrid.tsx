"use client";

import styles from "./notegrid.module.css";
import { Note } from "@/types/note";
import NoteCard from "../notecard/NoteCard";
import { useOptimistic } from "react";

export default function NoteGrid({ data }: { data: Note[] }) {
  const [optimisticNotes, removeOptimisticNote] = useOptimistic(
    data,
    (currentNotes, noteIdToRemove: string) =>
      currentNotes.filter((note) => note.id !== noteIdToRemove),
  );
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
