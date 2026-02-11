"use client";

import { useRouter } from "next/navigation";
import NoteForm from "@/components/noteform/NoteForm";
import { Note } from "@/types/note";

export default function CreateNotePage() {
  const router = useRouter();

  const handleCreate = (data: Partial<Note>) => {
    // 1. Get existing notes from localStorage
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");

    // 2. Create the new note object
    const newNote: Note = {
      id: Date.now().toString(),
      title: data.title || "Untitled",
      content: data.content || "",
      category: data.category || "work",
    };

    // 3. Save back to localStorage
    localStorage.setItem("notes", JSON.stringify([newNote, ...savedNotes]));

    // 4. Redirect to home
    router.push("/notes");
  };

  return <NoteForm onSubmit={handleCreate} titleText="Create New Note" />;
}
