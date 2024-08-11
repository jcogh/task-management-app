export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
