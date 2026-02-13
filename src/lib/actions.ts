'use server';

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";

export async function createNoteAction(data: { title: string; content: string; category: string }) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  try {
    await db.insert(notes).values({ ...data, userId });
    
    // We revalidate so the data is fresh when we redirect manually
    revalidatePath("/notes"); 
    
    return { success: true }; // Return a "Signal" instead of redirecting
  } catch (e) {
    return { success: false, error: "Database error" };
  }
}

export async function updateNoteAction(
  id: string, 
  data: { title: string; content: string; category: string }
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  try {
    await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(), // Update the timestamp
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    revalidatePath("/notes");
    return { success: true };
  } catch (e) {
    return { success: false };
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
    console.error("Delete failed:", error);
    return { success: false, error: "Database error" };
  }
}