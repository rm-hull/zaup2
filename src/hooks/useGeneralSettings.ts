import { type sortBy } from "../otp";
import useLocalStorage from "./useLocalStorage";

export interface GeneralSettings {
  syncToGoogleDrive?: boolean;
  showQRCode?: boolean;
  showCountdownTimer?: boolean;
  showCounts?: boolean;
  sortOrder?: keyof typeof sortBy;
  encrypted?: boolean;
}

export default function useGeneralSettings(): [
  GeneralSettings | undefined,
  (value: GeneralSettings | undefined) => void,
] {
  return useLocalStorage<GeneralSettings>("zaup2.general-settings", {
    syncToGoogleDrive: false,
    showQRCode: true,
    showCountdownTimer: true,
    showCounts: true,
    sortOrder: "name",
    encrypted: false,
  });
}
