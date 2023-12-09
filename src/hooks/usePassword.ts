import { atom, useAtom } from "jotai";

const password = atom<string | undefined>(undefined);

type UsePasswordReturnType = [string | undefined, (password: string) => void];

export default function usePassword(): UsePasswordReturnType {
  return useAtom(password);
}
