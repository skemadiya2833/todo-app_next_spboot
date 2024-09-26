import { PayloadAction } from "@reduxjs/toolkit";
import { put } from "redux-saga/effects";
import router from "next/router";

import { SignUpRequestBody } from "../../interfaces/signup-request";
import { LoginResponse } from "../../interfaces/login-response";
import { loginSuccess, logout, userUpdateSuccess } from "../slices/user-slice";
import { LoginRequestBody } from "../../interfaces/login-request";
import { UserUpdate } from "../../interfaces/user-update";
import { UserDetails } from "../../interfaces/user-details";

import { setSuccess } from "@/components/common/slices/information-slice";
import {
  apiCall,
  getToken,
  updateLocal,
  updateLocalUserDetails,
} from "@/utils/common-utils";

export function* signUpRequest(action: PayloadAction<SignUpRequestBody>) {
  const data: LoginResponse = yield apiCall<LoginResponse>({
    route: "auth/signup",
    method: "POST",
    body: JSON.stringify(action.payload),
  });

  if (data) {
    yield put(loginSuccess(data));
    yield put(setSuccess("Signed Up Successfully"));
    updateLocal(data);
    router.push("/");
  }
}

export function* handleLogin(action: PayloadAction<LoginRequestBody>) {
  const data: LoginResponse = yield apiCall<LoginResponse>({
    route: "auth/login",
    method: "POST",
    body: JSON.stringify(action.payload),
  });

  if (data) {
    yield put(loginSuccess(data));
    yield put(setSuccess("Login Success"));
    updateLocal(data);
    router.push("/");
  }
}

export function* handleUserUpdation(action: PayloadAction<UserUpdate>) {
  const token = getToken();
  const data: UserDetails = yield apiCall<UserDetails>({
    route: `api/user`,
    method: "PUT",
    token,
    body: JSON.stringify(action.payload),
  });

  if (data) {
    yield put(setSuccess("Profile Updated Successfully."));
    updateLocalUserDetails(data);
    yield put(userUpdateSuccess(data));

    return;
  }
}

export function* handleAccountDeletion(action: PayloadAction<string>) {
  const token = getToken();
  const resp: boolean = yield apiCall<boolean>({
    route: `api/user/delete`,
    method: "PUT",
    token,
    body: JSON.stringify({ password: action.payload }),
  });

  if (resp) {
    yield put(setSuccess("Account Deleted Successfully."));
    yield put(logout());
    localStorage.clear();
    router.push("/signup");
  }
}

export function* handleLogout() {
  const token = getToken();
  const resp: boolean = yield apiCall<boolean>({
    route: `api/user/logout`,
    method: "POST",
    token,
  });

  if (resp) {
    yield put(setSuccess("Logged Out Successfully."));
    yield put(logout());
    localStorage.clear();
    router.push("/login");
  }
}
