import { useLocalStorage } from "@rm-hull/use-local-storage";
import { type sortBy } from "../otp";

export interface GeneralSettings extends Record<string, unknown> {
  syncToGoogleDrive?: boolean;
  showQRCode?: boolean;
  showCountdownTimer?: boolean;
  showCounts?: boolean;
  sortOrder?: keyof typeof sortBy;
  encrypted?: boolean;
}

const initialValue: GeneralSettings = {
  syncToGoogleDrive: false,
  showQRCode: true,
  showCountdownTimer: true,
  showCounts: true,
  sortOrder: "name",
  encrypted: false,
};

export default function useGeneralSettings() {
  const { value: settings, setValue: updateSettings } = useLocalStorage<GeneralSettings>("zaup2.general-settings", {
    initialValue,
  });

  return { settings, updateSettings };
}
