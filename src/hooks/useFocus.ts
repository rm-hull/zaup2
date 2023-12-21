import { type RefObject, useRef } from "react";

export default function useFocus(): [RefObject<HTMLInputElement>, () => void] {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = (): void => {
    if (htmlElRef.current !== null) {
      htmlElRef.current.focus();
    }
  };

  return [htmlElRef, setFocus];
}
