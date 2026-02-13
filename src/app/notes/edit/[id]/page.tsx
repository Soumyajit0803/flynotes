import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import NoteForm from "@/components/noteform/NoteForm";
import { Note } from "@/types/note";


export default async function UpdateNotePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Security: Get the current user
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) return <div>Please sign in.</div>;

  // Fetch real data from Neon
  const [note] = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.id, id), 
        eq(notes.userId, userId) // Ensure I can't edit someone else's note
      )
    );

  // 4. If note doesn't exist, show 404
  if (!note) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* We pass the real database note to the form */}
      <NoteForm 
        initialData={note as Note} 
        titleText="Edit Note" 
      />
    </div>
  );
}