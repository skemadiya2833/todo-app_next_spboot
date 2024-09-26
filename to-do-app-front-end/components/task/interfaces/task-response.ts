import { Task } from "./task";

export interface TaskResponse {
  content: Task[];
  totalElements: number;
  totalPages: number;
  number: number;
}
