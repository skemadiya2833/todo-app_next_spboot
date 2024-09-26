import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "redux-saga/effects";

import { Category } from "../../interfaces/category";
import { setCategories } from "../slices/category-slice";

import { apiCall, getToken } from "@/utils/common-utils";

export function* handleFetchCategories(action: PayloadAction<string>) {
  const token = getToken();
  const data: Category[] = yield apiCall<Category[]>({
    route: `api/category?query=${action.payload}`,
    token,
  });

  if (data) {
    yield put(setCategories(data));
  }
}
