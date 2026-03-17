# Flynotes - AI powered note-taking app

Flynotes is a minimalistic note-taking application engineered with a Retrieval-Augmented Generation (RAG) search architecture. Rather than relying on rigid keyword matching, Flynotes utilizes high-dimensional vector embeddings to understand the underlying semantic meaning of notes, allowing users to search with conceptual understanding.

---
## System Architecture & Tech Stack

* **Frontend Framework:** Next.js 15 (App Router)
* **UI/UX:** `react.js` (Server & Client Components), and `lucide-react` for iconography.
* **State management:** Usage of `useOptimistic` and `useTransition` for implementing optimistic UI.
* **Authentication:** `clerk` (Server-side and client-side route protection).
* **Database:** `Neon` (Serverless PostgreSQL) augmented with the `pgvector` extension for *native vector storage*.
* **ORM:** `drizzle-orm` (handling schema definition, migrations, and complex geometric spatial queries).
* **AI Engine:** Google Gemini API (`gemini-embedding-001` model).

---

## The RAG (Retrieval-Augmented Generation) Pipeline

### Phase 1: Ingestion & Vectorization

1. **Data Capture:** A user creates or updates a note via the UI.
2. **Semantic Translation:** The title and content are concatenated and sent securely from a Next.js Server Action to the Google Gemini API.
3. **Embedding Generation:** The `gemini-embedding-001` model analyzes the text and returns a dense vector— a mathematical array of exactly **3,072 floating-point numbers** that map the text's semantic coordinates.
4. **Persistent Storage:** Drizzle ORM writes the note's text, metadata, and the 3072-dimensional vector into the Neon database directly into a `vector` column.

### Phase 2: Semantic Retrieval & Fallback Execution

1. **Query Translation:** When a user searches (e.g., "financial concepts"), the query is debounced and sent to the Gemini API to generate a temporary "Search Vector."
2. **Spatial Calculation:** Drizzle executes a query against Neon using the `<=>` Postgres operator to calculate the **Cosine Distance** between the search vector and every note vector in the database.
3. **Quality Control:** The database applies the user's requested limit and returns first *x* most similar notes.
4. **Dynamic UI Rendering:** The server action dynamically calculates a "Match Percentage" `(1 - distance) * 100` and returns the notes along with their match percentage to the frontend.
5. **Graceful Degradation:** If the Gemini API experiences any network issue (e.g. timeout, rate limit exceeded), the backend silently catches the error, bypasses the vector math, and instantly executes a standard SQL `ILIKE` keyword search, ensuring zero downtime for the user.


