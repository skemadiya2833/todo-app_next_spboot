import { put } from "redux-saga/effects";

import { fetchRemainderFailure, setReminders } from "../slices/reminder-slice";

import { TaskResponse } from "@/components/task/interfaces/task-response";
import { getToken, apiCall } from "@/utils/common-utils";

export function* handleFetchReminders() {
  const token = getToken();
  const data: TaskResponse = yield apiCall<TaskResponse>({
    route: `api/task/reminders`,
    token,
  });

  if (data) {
    yield put(setReminders(data.content));

    return;
  }
  yield put(fetchRemainderFailure());
}
