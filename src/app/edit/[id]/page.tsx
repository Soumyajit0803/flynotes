import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNoteByIdAction } from "@/lib/actions"; // Adjust import path if needed
import NoteForm from "@/components/noteform/NoteForm"; // Example import for your UI
import { Note } from "@/types/note";

export async function generateMetadata() {
  return {
    title: "Update Note",
  };
}

export default async function UpdateNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Securely fetch the active NextAuth session
  const session = await getServerSession(authOptions);
  
  // 2. Extract the database ID (powered by our next-auth.d.ts declaration)
  const userId = session?.user?.id;

  // 3. Gatekeeper: If no valid session exists, halt rendering
  if (!userId) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--foreground)" }}>
        <h2>Authentication Required</h2>
        <p>Please sign in to update your notes.</p>
      </div>
    );
  }

  // 4. Await the parameters and fetch the specific note
  const { id } = await params;
  const note = (await getNoteByIdAction(id)) as Note | null;

  // 5. If the note doesn't exist (or doesn't belong to this userId), trigger the 404 UI
  if (!note) {
    notFound();
  }

  // 6. Render your aesthetic update form, passing the secured note data
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Edit Note</h1>
      </header>
      
      <NoteForm initialData={note} titleText={note?.title} /> 
     
    </main>
  );
}