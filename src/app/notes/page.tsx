"use client";

import pageStyles from "../page.module.css";
import NoteCard from "../../components/notecard/NoteCard"; // Make sure to create this component
import styles from "./notes.module.css"; // Create this for the grid layout
import { Note } from "@/types/note";
import { Plus } from "lucide-react";
import Link from "next/link";

// 1. Mock Data (This would normally come from an API or LocalStorage)
const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Project Ideas",
    content:
      "Build a note-making app using Next.js, TSX, and pnpm. Include dark mode and category filtering.",
    category: "work",
    updatedAt: Date.now(),
  },
  {
    id: "2",
    title: "Grocery List",
    content: "Milk, Eggs, Bread, and some coffee beans for the week.",
    category: "personal",
    updatedAt: Date.now() - 86400000, // Yesterday
  },
  {
    id: "3",
    title: "App Concepts",
    content:
      "An AI-powered recipe generator that uses only what's in your fridge.",
    category: "personal",
    updatedAt: Date.now() - 172800000, // 2 days ago
  },
];

export default function Notes() {
  // Handlers for the buttons we put on the NoteCard
  const handleDelete = (id: string) => console.log("Delete note:", id);
  const handleEdit = (id: string) => console.log("Edit note:", id);

  return (
    <main className={pageStyles.main}>
      <header className={styles.header}>
        <h2>Your Notes</h2>
        <Link href="/notes/create" className={styles.newNoteBtn}>
          <Plus size={20} /> New Note
        </Link>
        {/* <span className={styles.count}>{MOCK_NOTES.length} Notes found</span> */}
      </header>

      {/* 2. The Grid Container */}
      <div className={styles.notesGrid}>
        {MOCK_NOTES.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </main>
  );
}
