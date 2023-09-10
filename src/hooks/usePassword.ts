import { atom, useAtom } from "jotai";

const password = atom<string | undefined>(undefined);

export default function usePassword() {
  return useAtom(password);
}
