import styles from "./page.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import NotesGrid from "@/components/notegrid/NoteGrid"; // Adjust path as needed
import { Note } from "@/types/note";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function AboutFlynotes() {
  return (
    <main className={styles.main}>
      <h2 className={styles.title}>Welcome to FlyNotes</h2>
      <p>
        <br />
        Your personal note-taking app built with Next.js and TypeScript.
        <br />
        Log in and take your notes the way you love.
      </p>
    </main>
  );
}

export default async function HomePage() {
  const { userId } = await auth();

  let userNotes: Note[] = [];
  if (userId) {
    userNotes = (await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))) as Note[];
  }
  return (
    <main className={styles.main}>
      {/* 1. If user is NOT logged in, show the "jargon" / description */}
      <SignedOut>
        <AboutFlynotes /> 
      </SignedOut>

      {/* 2. If user IS logged in, show the actual application dashboard */}
      <SignedIn>
        <section className="container mx-auto p-6">
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}>
            <h1 className={styles.title}>My Notes</h1>
            <Link href="/notes/create" className={styles.newNoteBtn}>
              + New Note
            </Link>
          </header>
          
          <NotesGrid data={userNotes} />
        </section>
      </SignedIn>
    </main>
  );
}
