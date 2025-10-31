import { type sortBy } from "../otp";
import { useLocalStorage } from "@rm-hull/use-local-storage";

export interface GeneralSettings {
  syncToGoogleDrive?: boolean;
  showQRCode?: boolean;
  showCountdownTimer?: boolean;
  showCounts?: boolean;
  sortOrder?: keyof typeof sortBy;
  encrypted?: boolean;
}

export default function useGeneralSettings() {
  const local = useLocalStorage<GeneralSettings>("zaup2.general-settings")
  return { 
    settings: local.value,
    updateSettings: local.setValue 
  }
  // , {
  //   syncToGoogleDrive: false,
  //   showQRCode: true,
  //   showCountdownTimer: true,
  //   showCounts: true,
  //   sortOrder: "name",
  //   encrypted: false,
  // });
}
