import styles from "./page.module.css";
import Link from "next/link";
import NotesGrid from "@/components/notegrid/NoteGrid";
import { getNotesByQueryAction } from "@/lib/actions";
import SearchBar from "@/components/searchbar/SearchBar";
import { Plus } from "lucide-react";
import EmptyStateCard from "@/components/emptystate/EmptyState";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

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
  // 2. Securely check the active session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // 3. The Gatekeeper: If not logged in, show the landing page ONLY
  if (!userId) {
    return (
      <main className={styles.main}>
        <AboutFlynotes />
      </main>
    );
  }

  // 4. If logged in, safely parse params and fetch the user's specific notes
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const limit = parseInt(resolvedParams.limit || "4", 10);

  const userNotes = await getNotesByQueryAction(query, limit);

  // 5. Render the Dashboard
  return (
    <main className={styles.main}>
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
        
        {userNotes.error && (
          <EmptyStateCard head="Database Error" body={userNotes.error} />
        )}
        
        {!userNotes.error && !userNotes.data.length && (
          <EmptyStateCard 
            head="No notes found" 
            body="Create your first note to get started." 
          />
        )}
        
        <NotesGrid response={userNotes} />
      </section>
    </main>
  );
}
