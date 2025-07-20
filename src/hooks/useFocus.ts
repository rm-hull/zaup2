import { type RefObject, useCallback, useRef } from "react";

export default function useFocus(): [RefObject<HTMLInputElement | null>, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => {
    htmlElRef.current?.focus();
  }, [htmlElRef]);

  return [htmlElRef, setFocus];
}
