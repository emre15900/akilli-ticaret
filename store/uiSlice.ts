import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

interface UIState {
  isGlobalLoading: boolean;
  errorMessage: string | null;
}

const initialState: UIState = {
  isGlobalLoading: false,
  errorMessage: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    clearGlobalError: (state) => {
      state.errorMessage = null;
    },
  },
});

export const uiReducer = uiSlice.reducer;
export const { setGlobalLoading, setGlobalError, clearGlobalError } =
  uiSlice.actions;

export const selectGlobalError = (state: RootState) => state.ui.errorMessage;
export const selectIsGlobalLoading = (state: RootState) =>
  state.ui.isGlobalLoading;

