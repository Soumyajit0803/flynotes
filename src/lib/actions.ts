'use server';

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { Note } from "@/types/note";
import { auth } from "@clerk/nextjs/server";
import { desc } from "drizzle-orm";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchNotesAction():Promise<{ success: boolean; error?: string; data: Note[] }> {
try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const data = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));

    return { success: true, data: data as Note[] };
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, data: [], error: "Failed to load notes" };
  }
}

export async function createNoteAction(data: { title: string; content: string; category: string }) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  try {
    await db.insert(notes).values({ ...data, userId });
    
    // We revalidate so the data is fresh when we redirect manually
    revalidatePath("/notes"); 
    
    return { success: true }; // Return a "Signal" instead of redirecting
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: `${message}` };
  }
}

// lib/actions.ts
export async function getNoteByIdAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    
  return note;
}

export async function updateNoteAction(
  id: string, 
  data: { title: string; content: string; category: string }
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  try {
    await delay(5000);
    await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(), // Update the timestamp
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: `${message}` };
  }
}

export async function deleteNoteAction(noteId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Security: Only delete if the note belongs to the current user
    await db.delete(notes)
      .where(
        and(
          eq(notes.id, noteId),
          eq(notes.userId, userId)
        )
      );

    // Refresh the /notes page to remove the card from the UI
    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: `${message}` };
  }
}