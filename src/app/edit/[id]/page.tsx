import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import NoteForm from "@/components/noteform/NoteForm";
import { Note } from "@/types/note";
import { getNoteByIdAction } from "@/lib/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getNoteByIdAction(id);

  return {
    title: note ? `Editing: ${note.title}` : "Note Not Found",
  };
}

export default async function UpdateNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Security: Get the current user
  const { userId } = await auth();
  const { id } = await params;
  const note = await getNoteByIdAction(id);

  if (!userId) return <div>Please sign in.</div>;

  // 4. If note doesn't exist, show 404
  if (!note) {
    notFound();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      {/* We pass the real database note to the form */}
      <NoteForm initialData={note as Note} titleText="Edit Note" />
    </div>
  );
}
