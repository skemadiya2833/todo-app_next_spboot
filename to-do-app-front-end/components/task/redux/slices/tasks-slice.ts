import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "@/components/task/interfaces/task";
import { TaskResponse } from "@/components/task/interfaces/task-response";
import { CreateTask } from "@/components/task/interfaces/create-task";

interface TasksState {
  tasks: Task[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  pageNumber: number;
}

const initialState: TasksState = {
  tasks: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  pageNumber: 1,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    filterTasksFailure(state: TasksState) {
      state.loading = false;
    },
    setTasks(state: TasksState, action: PayloadAction<TaskResponse>) {
      state.tasks = action.payload.content;
      state.pageNumber = action.payload.number;
      state.totalPages = action.payload.totalPages;
      state.totalElements = action.payload.totalElements;
      state.loading = false;
    },
    addTask(_state: TasksState, _action: PayloadAction<{ createTask: CreateTask, params: string}>) {},
    editTask(
      _state: TasksState,
      _action: PayloadAction<{ id: number; formData: CreateTask }>,
    ) {},
    updateTask(state: TasksState, action: PayloadAction<Task>) {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );

      if (index >= 0) state.tasks[index] = action.payload;
      else state.tasks.push(action.payload);
    },
    deleteTask(state: TasksState, _action: PayloadAction<{id: number, params: string}>) {
      state.loading = true;
    },
    filterTasks(
      state: TasksState,
      _action: PayloadAction<string>
    ) {
      state.loading = true;
    },
    importCSV(state: TasksState, _action: PayloadAction<{file: File, params: string}>) {
      state.loading = true;
    },
    downloadCSV(
      _state: TasksState,
      _action: PayloadAction<{ params: string; pageNo: number }>,
    ) {},
    stopLoading(state: TasksState) {
      state.loading = false;
    },
  },
});

export const {
  setTasks,
  addTask,
  editTask,
  deleteTask,
  filterTasks,
  filterTasksFailure,
  updateTask,
  importCSV,
  downloadCSV,
  stopLoading,
} = tasksSlice.actions;
export default tasksSlice.reducer;
