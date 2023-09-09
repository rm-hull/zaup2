import useLocalStorage from "./useLocalStorage";

type GeneralSettings = {
  showQRCode?: boolean;
  showCounts?: boolean;
};

export default function useGeneralSettings(): [
  GeneralSettings | undefined,
  (value: GeneralSettings | undefined) => void,
] {
  return useLocalStorage<GeneralSettings>("zaup2.general-settings");
}
