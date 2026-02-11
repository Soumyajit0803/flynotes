import pageStyles from "@/app/page.module.css";
import NoteCard from "@/components/notecard/NoteCard"; // Make sure to create this component
import styles from "./notes.module.css"; // Create this for the grid layout
import { Note } from "@/types/note";
import { LockIcon, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NoteGrid from "@/components/notegrid/NoteGrid";

export default async function Notes() {
  const { userId } = await auth();

  let userNotes: Note[] = [];
  if (userId) {
    userNotes = (await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))) as Note[];
  }

  return (
    <main className={pageStyles.main}>
      {/* 1. If User is NOT logged in */}
      <SignedOut>
        <div className={styles.loginContainer}>
          <p>You need to be logged in to see your notes</p>
          <br />
          <SignInButton mode="modal">
            <button className={styles.newNoteBtn}> <LockIcon size={20} /> Sign In to Flynotes</button>
          </SignInButton>
        </div>
      </SignedOut>

      {/* 2. If User IS logged in */}
      <SignedIn>
        <header className={styles.header}>
          <h2>Your Notes</h2>
          <div className={styles.headerActions}>
            <Link href="/notes/create" className={styles.newNoteBtn}>
              <Plus size={20} /> New Note
            </Link>
            {/* This shows the user's profile picture and 'Sign Out' */}
            <UserButton />
          </div>
        </header>

        {userId && <NoteGrid data={userNotes} />}
      </SignedIn>
    </main>
  );
}
