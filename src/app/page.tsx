import styles from "./page.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import NotesGrid from "@/components/notegrid/NoteGrid"; // Adjust path as needed
import { fetchNotesAction } from "@/lib/actions";
import { Plus } from "lucide-react";

function AboutFlynotes() {
  return (
    <main>
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
  const userNotes = await fetchNotesAction();

  return (
    <main className={styles.main}>
      <SignedOut>
        <AboutFlynotes /> 
      </SignedOut>

      <SignedIn>
        <section className="container">
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
          }}>
            <h1 className={styles.title}>My Notes</h1>
            <Link href="/create" className={styles.newNoteBtn}>
              <Plus size={18} /> New Note
            </Link>
          </header>
          
          <NotesGrid data={userNotes?.data} />
        </section>
      </SignedIn>
    </main>
  );
}
