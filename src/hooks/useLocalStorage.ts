import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import isJson from "../utils/isJson";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localStorage = atom<Record<string, any> | undefined>(undefined);

type UseLocalStorageReturnType<T> = [T, (value: T | undefined) => void];

const useLocalStorage = <T>(key: string, initialValue: T, secretKey?: string): UseLocalStorageReturnType<T> => {
  const decryptData = (): T | undefined => {
    if (secretKey === undefined) {
      const item = window.localStorage.getItem(key);
      return item === null ? initialValue : (JSON.parse(item) as T);
    }

    let data = window.localStorage.getItem(key);
    if (data === undefined || data === null) {
      return initialValue;
    }

    // check to see if plain JSON (i.e. unencrypted): if so, do a one type migration
    if (isJson(data)) {
      data = CryptoJS.AES.encrypt(data, secretKey).toString();
      window.localStorage.setItem(key, data);
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted) as T;
    } catch (ex) {
      throw Error("Unable to decrypt: Bad secret key?");
    }
  };

  const encryptData = <T>(data: T): void => {
    if (secretKey === undefined) {
      window.localStorage.setItem(key, JSON.stringify(data));
      return;
    }
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    window.localStorage.setItem(key, encrypted);
  };

  const readValue = (): T | undefined => {
    if (typeof window === "undefined") {
      return undefined;
    }

    return decryptData();
  };

  const [storedValue, setStoredValue] = useAtom(localStorage);

  const setValue = (value: T | undefined): void => {
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        encryptData(value);
      }

      setStoredValue((prev) => ({ ...prev, [key]: value }));
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  useEffect(() => {
    setStoredValue((prev) => ({ ...prev, [key]: readValue() }));

    const handleStorageChange = (): void => {
      setStoredValue((prev) => ({ ...prev, [key]: readValue() }));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue?.[key] as T, setValue];
};

export default useLocalStorage;
