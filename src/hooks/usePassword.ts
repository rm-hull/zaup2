import { atom, useAtom } from "jotai";

const password = atom<string | undefined>(undefined);

type UsePasswordReturnType = [string | undefined, (password: string | undefined) => void];

export default function usePassword(): UsePasswordReturnType {
  return useAtom(password);
}
