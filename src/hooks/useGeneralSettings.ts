import useLocalStorage from "./useLocalStorage";
import { type sortBy } from "../otp";

interface GeneralSettings {
  showQRCode?: boolean;
  showCounts?: boolean;
  sortOrder?: keyof typeof sortBy;
  encrypted?: boolean;
}

export default function useGeneralSettings(): [
  GeneralSettings | undefined,
  (value: GeneralSettings | undefined) => void,
] {
  return useLocalStorage<GeneralSettings>("zaup2.general-settings");
}
