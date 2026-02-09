'use client';

import { useParams, useRouter } from 'next/navigation';
import NoteForm from '@/components/noteform/NoteForm';
import { Note } from '@/types/note';

export default function UpdateNotePage() {
  const params = useParams(); // Hook to get the [id]
  const router = useRouter();
  const noteId = params.id;

  // In a real app, you'd fetch the note from localStorage or a DB using the ID
  const mockNote: Note = {
    id: noteId as string,
    title: "Existing Note",
    content: "Content to edit",
    category: "work",
    updatedAt: Date.now()
  };

  const handleUpdate = (updatedData: Partial<Note>) => {
    console.log("Updating note", noteId, updatedData);
    // Logic to save change goes here
    router.push('/notes');
  };

  return (
    <NoteForm 
      initialData={mockNote} 
      onSubmit={handleUpdate} 
      titleText="Edit Note" 
    />
  );
}