"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Loader, Save } from "lucide-react";
import styles from "./NoteForm.module.css";
import { Category, Note } from "@/types/note";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNoteAction, updateNoteAction } from "@/lib/actions";
import ConfirmModal from "../modals/ConfirmModal";

interface NoteFormProps {
  initialData?: Note;
  titleText: string;
}

export default function NoteForm({
  initialData,
  titleText,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState<Category>(
    initialData?.category || "work",
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  
  const isDirty = 
    title.trim() !== initialData?.title || 
    content.trim() !== initialData?.content || 
    category !== initialData?.category;
  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return toast.warning("No changes to save");
    setIsModalOpen(true);
  };


  const handleConfirmSave = async () => {
    
    setIsModalOpen(false);
    startTransition(async()=>{
      const noteData = { title, content, category };
      let result;
  
      if (initialData?.id) {
        result = await updateNoteAction(initialData.id, noteData);
      } else {
        result = await createNoteAction(noteData);
      }
  
      if (result.success) {
        toast.success(initialData ? "Note updated!" : "Note created!");
        router.push("/");
      } else {
        toast.error(result.error || "Failed to save note");
      }
    })
  };

  return (
    <form onSubmit={handleOpenModal} className={styles.form}>
      <p onClick={() => !isPending && router.back()} 
        className={styles.backLink}
          style={{cursor: isPending ? "not-allowed" : "pointer",
                opacity: isPending ? 0.5 : 1
          }}
        >
        ← Back to Notes
      </p>
      <h1>{titleText}</h1>

      <div className={styles.field}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isPending}
          style={{ cursor: isPending ? "not-allowed" : "text", opacity: isPending ? 0.5 : 1 }}
        />
      </div>

      <div className={styles.field}>
        <label>Category</label>
        <div className={styles.selectWrapper}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            disabled={isPending}
          style={{ cursor: isPending ? "not-allowed" : "text", opacity: isPending ? 0.7 : 1 }}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
          </select>
          <ChevronDown className={styles.selectIcon} size={18} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={isPending}
          style={{ cursor: isPending ? "not-allowed" : "text", opacity: isPending ? 0.7 : 1 }}
        />
      </div>

      {isPending ? (
        <button className={styles.submitBtn} style={{cursor: "not-allowed"}} disabled >
          <Loader size={18} /> Saving...
        </button>
      ) : (
        <button type="submit" className={styles.submitBtn}>
          <Save size={18} /> {initialData ? "Update Note" : "Create Note"}
        </button>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title={title}
        type={initialData ? "update" : "create"}
      />
    </form>
  );
}
