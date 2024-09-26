import moment from "moment";
import router from "next/router";
import { call, put } from "redux-saga/effects";

import {
  setError,
  setWarnings,
} from "@/components/common/slices/information-slice";
import { LoginResponse } from "@/components/user/interfaces/login-response";
import { UserDetails } from "@/components/user/interfaces/user-details";
import { FilterState } from "@/components/common/interfaces/filter-state";

export const API_URL = "http://localhost:8080";

export function updateLocal(data: LoginResponse) {
  localStorage.setItem("usr_cache", btoa(JSON.stringify(data)));
}

export function updateLocalUserDetails(userDetails: UserDetails) {
  const data: LoginResponse = JSON.parse(
    atob(localStorage.getItem("usr_cache")!),
  );

  data.user = userDetails;
  localStorage.setItem("usr_cache", btoa(JSON.stringify(data)));
}

export function getToken(): string {
  try {
    const token = JSON.parse(atob(localStorage.getItem("usr_cache")!)).token;

    return token;
  } catch (err) {
    localStorage.clear();
    router.push("/login");

    return "";
  }
}

Date.prototype.toJSON = function () {
  return moment(this).format("YYYY-MM-DDTHH:mm:ss.ms[Z]");
};

export function* apiCall<T>({
  route,
  method = "GET",
  token = "",
  body = null,
}: {
  route: string;
  method?: string;
  token?: string;
  body?: string | null;
}) {
  try {
    const response: Response = yield call(fetch, `${API_URL}/${route}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      body,
    });

    if (response.ok) {
      if (response.status === 204) return true;
      const data: T = yield response.json();

      return data;
    }
    const data: Record<string, string> = yield response.json();

    if (data["message"]) {
      yield put(setError(data.message));
    } else {
      yield put(setWarnings(data));
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message ?? "An error occurred while API Call";

    yield put(setError(errorMessage));
  }
}

export const getParams = (filters: FilterState) => {
  let params = `startDate=${filters.date.start.toString()}&endDate=${filters.date.end.toString()}`;
  params =
    filters.query.length > 0
      ? params.concat(`&query=${filters.query}`)
      : params;
  params = filters.priority
    ? params.concat(`&priority=${filters.priority}`)
    : params;
  params = filters.sort ? params.concat(`&sort=${filters.sort}`) : params;
  params = filters.sortType
    ? params.concat(`&sortType=${filters.sortType}`)
    : params;
  params = filters.categoryId
    ? params.concat(`&categoryId=${filters.categoryId}`)
    : params;
  params = filters.status
    ? params.concat(`&status=${filters.status}`)
    : params;
  params = params.concat(`&overdues=${filters.overdues}`);

  return params;
};