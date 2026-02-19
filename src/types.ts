export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: Priority;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'priority' | 'dueDate' | 'created';
