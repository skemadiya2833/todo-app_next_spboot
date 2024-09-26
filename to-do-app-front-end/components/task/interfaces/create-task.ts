export interface CreateTask {
  title: string;
  description: string;
  categoryId: number | null;
  priority: string;
  status: string;
  startDateTime: Date;
  deadline: Date;
  reminder: Date | null;
  thumbnail: string | null;
}
