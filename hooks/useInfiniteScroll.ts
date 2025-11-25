"use client";

import { useCallback, useEffect, useRef } from "react";

interface InfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
}: InfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry?.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore],
  );

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
      threshold: 0.1,
    });

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  return sentinelRef;
};

