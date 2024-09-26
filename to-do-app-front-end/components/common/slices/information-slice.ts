import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InformationState {
  success: null | string;
  warning: null | Record<string, string>;
  error: null | string;
}

const initialState: InformationState = {
  success: null,
  warning: null,
  error: null,
};

const informationSlice = createSlice({
  name: "information",
  initialState,
  reducers: {
    setSuccess(state: InformationState, action: PayloadAction<string>) {
      state.success = action.payload;
    },
    setWarnings(
      state: InformationState,
      action: PayloadAction<Record<string, string>>,
    ) {
      state.warning = action.payload;
    },
    setError(state: InformationState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearInformations(state: InformationState) {
      state.success = null;
      state.warning = null;
      state.error = null;
    },
  },
});

export const { setSuccess, setWarnings, setError, clearInformations } =
  informationSlice.actions;
export default informationSlice.reducer;
