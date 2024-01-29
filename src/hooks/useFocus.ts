import { type RefObject, useRef, useCallback } from "react";

export default function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = useCallback(() => {
    if (htmlElRef.current !== null) {
      htmlElRef.current.focus();
    }
  }, [htmlElRef]);

  return [htmlElRef, setFocus];
}
