import { Category } from "../../category/interfaces/category";

export interface Task {
  id: number;
  title: string;
  description: string;
  category: Category | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  deadline: string;
  thumbnail: string | null;
  reminder: string | null;
  startDateTime: string;
}
