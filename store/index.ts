import { configureStore } from "@reduxjs/toolkit";
import { favoritesReducer } from "./favoritesSlice";
import { uiReducer } from "./uiSlice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

