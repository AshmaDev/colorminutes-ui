"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_UNDO_TIMEOUT_MS = 10_000;

export function usePendingUndo<T>(timeoutMs = DEFAULT_UNDO_TIMEOUT_MS) {
  const [pending, setPending] = useState<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPending(null);
  }, []);

  const pushPending = useCallback(
    (item: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPending(item);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setPending(null);
      }, timeoutMs);
    },
    [timeoutMs],
  );

  const revertPending = useCallback(
    (restore: (item: T) => void) => {
      if (!pending) return;
      restore(pending);
      clearPending();
    },
    [pending, clearPending],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { pending, pushPending, revertPending, clearPending };
}
