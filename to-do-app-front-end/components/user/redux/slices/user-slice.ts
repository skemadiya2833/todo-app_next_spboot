"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LoginResponse } from "@/components/user/interfaces/login-response";
import { UserState } from "@/components/user/interfaces/user-state";
import { UserDetails } from "@/components/user/interfaces/user-details";
import { UserUpdate } from "@/components/user/interfaces/user-update";

function getInitialuserState() {
  if (typeof window !== "undefined" && localStorage.getItem("usr_cache")) {
    const localdata = JSON.parse(atob(localStorage.getItem("usr_cache")!));

    return {
      userDetails: localdata.user,
      jwtToken: localdata.token,
    };
  }

  return {
    userDetails: null,
    jwtToken: null,
  };
}

const initialState: UserState = getInitialuserState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest(
      _state: UserState,
      _action: PayloadAction<{ email: string; password: string }>,
    ) {},
    loginSuccess(state: UserState, action: PayloadAction<LoginResponse>) {
      state.userDetails = action.payload.user;
      state.jwtToken = action.payload.token;
    },
    logoutRequest(_state: UserState) {},
    logout(state: UserState) {
      state.userDetails = null;
      state.jwtToken = null;
    },
    signupRequest(
      _state: UserState,
      _action: PayloadAction<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }>,
    ) {},
    userUpdate(_state: UserState, _action: PayloadAction<UserUpdate>) {},
    userUpdateSuccess(state: UserState, action: PayloadAction<UserDetails>) {
      state.userDetails = action.payload;
    },
    deleteAccount(_state: UserState, _action: PayloadAction<string>) {},
  },
});

export const {
  loginRequest,
  loginSuccess,
  logoutRequest,
  logout,
  signupRequest,
  userUpdate,
  userUpdateSuccess,
  deleteAccount,
} = userSlice.actions;
export default userSlice.reducer;
