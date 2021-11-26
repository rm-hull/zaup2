import { atom, useAtom } from "jotai";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localStorage = atom<Record<string, any> | undefined>(undefined);

const useLocalStorage = <T>(key: string): [T | undefined, (value: T | undefined) => void] => {
  const readValue = () => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  };

  const [storedValue, setStoredValue] = useAtom(localStorage);

  const setValue = (value: T | undefined) => {
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }

      setStoredValue((prev) => ({ ...prev, [key]: value }));
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue((prev) => ({ ...prev, [key]: readValue() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleStorageChange = () => setStoredValue((prev) => ({ ...prev, [key]: readValue() }));

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue?.[key], setValue];
};

export default useLocalStorage;
