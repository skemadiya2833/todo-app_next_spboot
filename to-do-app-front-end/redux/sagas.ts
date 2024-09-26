import { takeLatest, all, takeEvery } from "redux-saga/effects";

import {
  loginRequest,
  signupRequest,
  userUpdate,
  deleteAccount,
  logoutRequest,
} from "../components/user/redux/slices/user-slice";
import {
  filterTasks,
  addTask,
  editTask,
  deleteTask,
  importCSV,
  downloadCSV,
} from "../components/task/redux/slices/tasks-slice";
import { fetchReminders } from "../components/reminder/redux/slices/reminder-slice";
import { fetchCategories } from "../components/category/redux/slices/category-slice";

import { handleFetchCategories } from "@/components/category/redux/saga/category-saga";
import { handleFetchReminders } from "@/components/reminder/redux/saga/reminder-saga";
import {
  handleAccountDeletion,
  handleLogin,
  handleLogout,
  handleUserUpdation,
  signUpRequest,
} from "@/components/user/redux/saga/user-saga";
import {
  handleDownloadCSV,
  handleFilterTasks,
  handleImportCSV,
  handleTaskCreation,
  handleTaskDeletion,
  handleTaskUpdation,
} from "@/components/task/redux/saga/task-saga";

function* watchEvery() {
  // categories
  yield takeEvery(fetchCategories.type, handleFetchCategories);
  // reminders
  yield takeEvery(fetchReminders.type, handleFetchReminders);
}

function* watchLatest() {
  // user
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(userUpdate.type, handleUserUpdation);
  yield takeLatest(logoutRequest.type, handleLogout);
  yield takeLatest(signupRequest.type, signUpRequest);
  yield takeLatest(deleteAccount.type, handleAccountDeletion);

  // task
  yield takeLatest(filterTasks.type, handleFilterTasks);
  yield takeLatest(addTask.type, handleTaskCreation);
  yield takeLatest(editTask.type, handleTaskUpdation);
  yield takeLatest(deleteTask.type, handleTaskDeletion);
  yield takeLatest(importCSV.type, handleImportCSV);
  yield takeLatest(downloadCSV.type, handleDownloadCSV);
}

export default function* rootSaga() {
  yield all([watchLatest(), watchEvery()]);
}
