"use client";

import { selectGlobalError, clearGlobalError } from "@/store/uiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export const GlobalStatusBanner = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectGlobalError);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl bg-red-600 px-4 py-3 text-white shadow-xl">
      <p className="text-sm font-medium">{errorMessage}</p>
      <button
        type="button"
        className="text-xs uppercase tracking-wide text-white/80 underline-offset-4 hover:underline"
        onClick={() => dispatch(clearGlobalError())}
      >
        Kapat
      </button>
    </div>
  );
};

