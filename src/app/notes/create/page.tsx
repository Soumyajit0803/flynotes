import NoteForm from "@/components/noteform/NoteForm";

export async function generateMetadata() {
  return {
    title: "Create New Note",
  };
}

export default function CreateNotePage() {
  return <NoteForm titleText="Create New Note" />;
}
