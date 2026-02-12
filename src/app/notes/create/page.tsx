"use client";

import { useRouter } from "next/navigation";
import NoteForm from "@/components/noteform/NoteForm";
import { Note } from "@/types/note";

export default function CreateNotePage() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/notes");
  };

  return <NoteForm onSubmit={handleCreate} titleText="Create New Note" />;
}
