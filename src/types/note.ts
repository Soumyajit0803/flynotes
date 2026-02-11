export type Category = 'work' | 'personal' | 'other';
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: Category; // Match your categories
  createdAt: Date; // Changed from number to Date
  updatedAt: Date; // Changed from number to Date
}
