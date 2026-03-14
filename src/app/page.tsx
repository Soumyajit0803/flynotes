import styles from "./page.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import NotesGrid from "@/components/notegrid/NoteGrid"; // Adjust path as needed
import { getNotesByQueryAction } from "@/lib/actions";
import SearchBar from "@/components/searchbar/SearchBar";
import { Plus } from "lucide-react";
import { Note } from "@/types/note";

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; limit?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const limit = parseInt(resolvedParams.limit || "4", 10);
  console.log("Search Query:", query);
  console.log("Limit:", limit);

  let userNotes: { success: boolean; data: Note[]; error?: string } = {
    success: false,
    data: [],
    error: "",
  };

  userNotes = await getNotesByQueryAction(query, limit);
  if(userNotes?.error) console.log(userNotes.error);
  return (
    <main className={styles.main}>
      <SignedOut>
        <AboutFlynotes />
      </SignedOut>

      <SignedIn>
        <section className={styles.container}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h1 className={styles.title}>My Notes</h1>
            <Link href="/create" className={styles.newNoteBtn}>
              <Plus size={18} /> New Note
            </Link>
          </header>
          <SearchBar />
          <NotesGrid response={userNotes} />
        </section>
      </SignedIn>
    </main>
  );
}
