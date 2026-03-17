"use server";

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { Note } from "@/types/note";
import { auth } from "@clerk/nextjs/server";
import { desc, sql, SQL } from "drizzle-orm";
import { and, eq, ilike, or } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getNotesByQueryAction(
  searchQuery = "",
  limitAmount = 10,
) {
  const { userId } = await auth();
  if (!userId) return { success: false, data: [], error: "Unauthorized" };

  if (!searchQuery || searchQuery.trim() === "") {
    // return everything
    const filters: SQL[] = [eq(notes.userId, userId)];

    try {
      const userNotes = await db
        .select({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          category: notes.category,
          updatedAt: notes.updatedAt,
        })
        .from(notes)
        .where(and(...filters))
        .orderBy(desc(notes.updatedAt));
      return { success: true, data: userNotes as Note[], error: "" };
    } catch (error) {
      return {
        success: false,
        data: [] as Note[],
        error: "Database error. Please try again later.",
      };
    }
  }
  try {
    // Generate embedding for the search query using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(searchQuery);
    const searchVector = result.embedding.values;

    // Calculate cosine similarity and order by it
    const distance = sql`${notes.embedding} <=> ${JSON.stringify(searchVector)}::vector`;

    const userNotes = await db
      .select({
        id: notes.id,
        title: notes.title,
        content: notes.content,
        category: notes.category,
        updatedAt: notes.updatedAt,
        similarity: sql<number>`1 - (${distance})`,
      })
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(
        sql`${notes.embedding} <=> ${JSON.stringify(searchVector)}::vector`,
      )
      .limit(limitAmount);

    return { success: true, data: userNotes as Note[], error: "" };
  } catch (error) {
    // fallback to simple keyword search

    try {
      const searchPattern = `%${searchQuery}%`;
      const fallbackNotes = await db
        .select({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          category: notes.category,
          updatedAt: notes.updatedAt,
        })
        .from(notes)
        .where(
          and(
            eq(notes.userId, userId),
            or(
              ilike(notes.title, searchPattern),
              ilike(notes.content, searchPattern),
              ilike(notes.category, searchPattern),
            ),
          ),
        )
        .orderBy(desc(notes.updatedAt))
        .limit(limitAmount);

      return {
        success: true,
        data: fallbackNotes as Note[],
        error:
          "AI search temporarily unavailable. Showing standard keyword search results.",
      };
    } catch (fallbackError) {
      return {
        success: false,
        data: [] as Note[],
        error: "Database error. Please try again later.",
      };
    }
  }
}

export async function createNoteAction(data: {
  title: string;
  content: string;
  category: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  // get the embedding vector from Gemini for the search text
  const textToEmbed = `Title: ${data.title}. Content: ${data.content}`;
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(textToEmbed);
  const embeddingVector = result.embedding.values;

  try {
    // 3. Save to Neon using Drizzle
    await db.insert(notes).values({
      userId: userId,
      title: data.title,
      content: data.content,
      category: data.category,
      embedding: embeddingVector,
    });

    // We revalidate so the data is fresh when we redirect manually
    revalidatePath("/");

    return { success: true }; // Return a "Signal" instead of redirecting
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
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
  data: { title: string; content: string; category: string },
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User not found" };

  try {
    // await delay(5000);
    const textToEmbed = `Title: ${data.title}. Content: ${data.content}`;

    // 2. Generate the new semantic vector using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(textToEmbed);
    const newEmbeddingVector = result.embedding.values;
    await db
      .update(notes)
      .set({
        title: data.title,
        content: data.content,
        category: data.category,
        embedding: newEmbeddingVector,
        updatedAt: new Date(), // Update the timestamp
      })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
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
    await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)));

    // Refresh the /notes page to remove the card from the UI
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: `${message}` };
  }
}
