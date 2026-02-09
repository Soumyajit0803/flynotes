'use client';

import { useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import styles from './NoteForm.module.css';
import { Category, Note } from '@/types/note';

interface NoteFormProps {
  initialData?: Note;
  onSubmit: (data: Partial<Note>) => void;
  titleText: string;
}

export default function NoteForm({ initialData, onSubmit, titleText }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<Category>(initialData?.category || 'work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, category });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>{titleText}</h1>
      
      <div className={styles.field}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={styles.field}>
        <label>Category</label>
        <div className={styles.selectWrapper}>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
          </select>
          <ChevronDown className={styles.selectIcon} size={18} />
        </div>
      </div>

      <div className={styles.field}>
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <button type="submit" className={styles.submitBtn}>
        <Save size={18} /> {initialData ? 'Update Note' : 'Create Note'}
      </button>
    </form>
  );
}