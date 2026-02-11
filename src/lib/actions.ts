'use server';

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
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