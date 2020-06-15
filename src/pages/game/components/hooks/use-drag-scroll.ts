import { useEffect, useCallback } from "react";

let timeoutId: any;
const RETRY_TIMEOUT = 5;
const SCROLL_BUFFER = 150;
const SCROLL_DIST = 5;

export const useDragScroll = (isDragging: boolean = false) => {
  const onMove = useCallback((e: PointerEvent) => {
    clearTimeout(timeoutId);
    if (e.clientY < SCROLL_BUFFER) {
      window.scroll({
        top: window.scrollY - SCROLL_DIST,
      });
      if (window.scrollY > 0.5) {
        timeoutId = setTimeout(() => onMove(e), RETRY_TIMEOUT);
      }
    } else if (e.clientY > window.innerHeight - SCROLL_BUFFER) {
      window.scroll({
        top: window.scrollY + SCROLL_DIST,
      });
      const d = document.documentElement;
      const offset = d.scrollTop + window.innerHeight;
      const height = d.offsetHeight;

      if (offset < height - 0.5) {
        timeoutId = setTimeout(() => onMove(e), RETRY_TIMEOUT);
      }
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", onMove);
    } else {
      window.removeEventListener("pointermove", onMove);
    }

    return () => window.removeEventListener("pointermove", onMove);
  }, [isDragging, onMove]);
};
