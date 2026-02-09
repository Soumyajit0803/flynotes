export type Category = 'work' | 'personal' | 'other';
export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  category: Category;
}
