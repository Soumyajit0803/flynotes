import { redirect } from "next/navigation";

export default function NotesPage() {
  redirect("/"); // Automatically send people to the new unified home
}