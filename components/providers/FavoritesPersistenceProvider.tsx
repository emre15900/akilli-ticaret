"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrateFavorites,
  loadFavoritesFromStorage,
  persistFavorites,
  selectFavoritesState,
} from "@/store/favoritesSlice";

export const FavoritesPersistenceProvider = () => {
  const dispatch = useAppDispatch();
  const favoritesState = useAppSelector(selectFavoritesState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) {
      return;
    }
    const stored = loadFavoritesFromStorage();
    if (stored) {
      dispatch(hydrateFavorites(stored));
    }
    hasHydrated.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }
    persistFavorites(favoritesState);
  }, [favoritesState]);

  return null;
};

