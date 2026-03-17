export type Category = 'work' | 'personal' | 'other';
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  similarity?: number; // Optional field for search results
}
