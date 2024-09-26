import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "@/components/task/interfaces/task";

interface RemindersState {
  reminders: Task[];
  loading: boolean;
}

const initialState: RemindersState = {
  reminders: [],
  loading: false,
};

const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {
    fetchReminders(state) {
      state.loading = true;
    },
    setReminders(state, action: PayloadAction<Task[]>) {
      state.reminders = action.payload;
      state.loading = false;
    },
    fetchRemainderFailure(state) {
      state.loading = false;
    },
  },
});

export const { fetchReminders, setReminders, fetchRemainderFailure } =
  remindersSlice.actions;
export default remindersSlice.reducer;
