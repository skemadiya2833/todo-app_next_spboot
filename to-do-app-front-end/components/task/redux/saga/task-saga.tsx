import { call, put } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import {
  filterTasks,
  filterTasksFailure,
  setTasks,
  stopLoading,
  updateTask,
} from "../slices/tasks-slice";
import { TaskResponse } from "../../interfaces/task-response";
import { CreateTask } from "../../interfaces/create-task";
import { Task } from "../../interfaces/task";

import {
  setError,
  setSuccess,
  setWarnings,
} from "@/components/common/slices/information-slice";
import { API_URL, apiCall, getToken } from "@/utils/common-utils";

export function* handleFilterTasks(action: PayloadAction<string>) {
  const token = getToken()
  let route = `api/task/all?${action.payload}`;
  const data: TaskResponse = yield apiCall<TaskResponse>({
    route,
    token,
  });

  if (data) {
    yield put(setTasks(data));

    return;
  }
  yield put(stopLoading());
}

export function* handleTaskCreation(action: PayloadAction<{ createTask: CreateTask, params: string}>) {
  const token = getToken();
  const data: Task = yield apiCall<Task>({
    route: `api/task`,
    method: "POST",
    token,
    body: JSON.stringify(action.payload.createTask),
  });

  if (data) {
    yield put(filterTasks(action.payload.params));

    return;
  }
  yield put(filterTasksFailure());
}

export function* handleTaskDeletion(action: PayloadAction<{id: number, params: string}>) {
  const token = getToken();
  const resp: boolean = yield apiCall<boolean>({
    route: `api/task/${action.payload.id}`,
    method: "DELETE",
    token,
  });

  if (resp) {
    yield put(filterTasks(action.payload.params));
    yield put(setSuccess("Task Deleted Successfully."));
  }
}

export function* handleTaskUpdation(
  action: PayloadAction<{ id: number; formData: CreateTask }>,
) {
  const token = getToken();
  const data: Task = yield apiCall<Task>({
    route: `api/task/${action.payload.id}`,
    method: "PUT",
    token,
    body: JSON.stringify(action.payload.formData),
  });

  if (data) {
    yield put(setSuccess("Task Updated Successfully."));
    yield put(updateTask(data));

    return;
  }
  yield put(filterTasksFailure());
}

export function* handleImportCSV(action: PayloadAction<{file: File, params: string}>) {
  const formData = new FormData();

  formData.append("file", action.payload.file);
  try {
    const token = getToken();
    const response: Response = yield call(fetch, `${API_URL}/api/task/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data: { tasks: Task[]; errors: Map<string, string> } =
        yield response.json();

      yield put(filterTasks(action.payload.params));
      if (Object.values(data.errors).length > 0) {
        yield put(
          setWarnings(data.errors as unknown as Record<string, string>),
        );

        return;
      }
      yield put(setSuccess("All Records Inserted Successfully"));

      return;
    }
    const data: { message: string } = yield response.json();

    yield put(setError(data.message));
    yield put(filterTasksFailure());
  } catch (error) {
    const errorMessage =
      (error as Error).message ?? "An error occurred while Creating Task.";

    yield put(setError(errorMessage));
    yield put(filterTasksFailure());
  }
}

export function* handleDownloadCSV(
  action: PayloadAction<{ params: string; pageNo: number }>,
) {
  try {
    const token = getToken();
    const response: Response = yield call(
      fetch,
      `${API_URL}/api/task/export?${action.payload.params}&page=${action.payload.pageNo}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      },
    );

    if (response.ok) {
      const data: Blob = yield response.blob();
      const file = window.URL.createObjectURL(data);

      window.location.assign(file);
      yield put(setSuccess("CSV File Downloaded"));

      return;
    }
    const data: { message: string } = yield response.json();

    yield put(setError(data.message));
  } catch (error) {
    const errorMessage =
      (error as Error).message ?? "An error occurred while fetching tasks.";

    yield put(setError(errorMessage));
  }
}
