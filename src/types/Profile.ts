export interface Profile {
  id: string;
  username: string;
  joinedat?: string;
  character?: string;
  waketime?: string;
  bedtime?: string;
  [key: string]: any;
}

export interface TaskType {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  reminder_time?: Date;
  created_at?: Date;
  category_id: number;
  user_id: string;
  repeat_interval?: string;
  duration_interval?: string;
  deadline_time?: Date;
}

export interface CategoryType {
  id: number;
  name: string;
  created_at: string;
  todos?: TaskType[];
}
