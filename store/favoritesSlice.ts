import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import type { FavoriteProductSummary } from "@/types/product";

export interface FavoritesState {
  items: Record<string, boolean>;
  entities: Record<string, FavoriteProductSummary>;
}

const STORAGE_KEY = "akilli-ticaret:favorites";

const initialState: FavoritesState = {
  items: {},
  entities: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    hydrateFavorites: (_, action: PayloadAction<FavoritesState>) => action.payload,
    toggleFavorite: (state, action: PayloadAction<FavoriteProductSummary>) => {
      const id = String(action.payload.id);
      const willBeFavorite = !state.items[id];
      state.items[id] = willBeFavorite;

      if (willBeFavorite) {
        state.entities[id] = action.payload;
      } else {
        delete state.entities[id];
      }
    },
    removeFavorite: (state, action: PayloadAction<number | string>) => {
      const id = String(action.payload);
      delete state.items[id];
      delete state.entities[id];
    },
  },
});

export const favoritesReducer = favoritesSlice.reducer;
export const { toggleFavorite, hydrateFavorites, removeFavorite } =
  favoritesSlice.actions;

export const loadFavoritesFromStorage = (): FavoritesState | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as FavoritesState;
    return {
      items: parsed.items ?? {},
      entities: parsed.entities ?? {},
    };
  } catch (error) {
    console.warn("Favoriler yüklenirken hata:", error);
    return null;
  }
};

export const persistFavorites = (state: FavoritesState) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const selectFavoritesState = (state: RootState) => state.favorites;

export const selectFavoriteSummaries = (state: RootState) =>
  Object.values(state.favorites.entities);

export const selectIsFavorite =
  (productId: number | string) => (state: RootState) =>
    Boolean(state.favorites.items[String(productId)]);

