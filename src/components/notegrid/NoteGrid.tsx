'use client';

import styles from "./notegrid.module.css";
import { Note } from "@/types/note";
import NoteCard from "../notecard/NoteCard";

export default function NoteGrid({data}: {data: Note[]}) {
  return (
    <div className={styles.notesGrid}>
      {data.map((note)=><NoteCard key={note.id} note={note as Note} />)}
    </div>
  );
}
