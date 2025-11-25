import { describe, expect, it } from "vitest";
import {
  favoritesReducer,
  toggleFavorite,
  hydrateFavorites,
  type FavoritesState,
} from "@/store/favoritesSlice";

const mockSummary = {
  id: 1,
  name: "Test Product",
  price: 100,
  currency: "TRY",
};

describe("favoritesSlice", () => {
  it("toggles favorite flag and stores summary", () => {
    const state = favoritesReducer(undefined, toggleFavorite(mockSummary));
    expect(state.items["1"]).toBe(true);
    expect(state.entities["1"].name).toBe("Test Product");
  });

  it("hydrates from persisted state", () => {
    const persisted: FavoritesState = {
      items: { "1": true },
      entities: { "1": mockSummary },
    };
    const state = favoritesReducer(undefined, hydrateFavorites(persisted));
    expect(state).toEqual(persisted);
  });
});

