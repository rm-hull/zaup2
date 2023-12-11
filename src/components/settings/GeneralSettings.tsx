import { FormControl, FormLabel, HStack, Heading, Radio, RadioGroup, Stack, Switch, VStack } from "@chakra-ui/react";
import { type JSX } from "react";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import { type sortBy } from "../../otp";
import SyncInfoPanel from "./SyncInfoPanel";

export default function GeneralSettings(): JSX.Element {
  const [settings, updateSettings] = useGeneralSettings();

  const handleToggleSyncToGoogleDrive = (): void => {
    updateSettings({ ...settings, syncToGoogleDrive: !(settings?.syncToGoogleDrive ?? false) });
  };

  const handleToggleShowQRCode = (): void => {
    updateSettings({ ...settings, showQRCode: !(settings?.showQRCode ?? false) });
  };

  const handleToggleShowCountdownTimer = (): void => {
    updateSettings({ ...settings, showCountdownTimer: !(settings?.showCountdownTimer ?? false) });
  };

  const handleToggleShowCounts = (): void => {
    updateSettings({ ...settings, showCounts: !(settings?.showCounts ?? false) });
  };

  const handleUpdateSortOrder = (sortOrder: keyof typeof sortBy): void => {
    updateSettings({ ...settings, sortOrder });
  };

  return (
    <>
      <Heading size="md">General Settings</Heading>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="sort-order" mb={0}>
          Sort grid by:
        </FormLabel>
        <RadioGroup id="sort-order" onChange={handleUpdateSortOrder} value={settings?.sortOrder}>
          <Stack direction="row">
            <Radio value="name">name</Radio>
            <Radio value="lastUsed">last used</Radio>
            <Radio value="mostUsed">most used</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <HStack alignItems="flex-start">
        <VStack gap={4} minWidth={250}>
          <FormControl display="flex" alignItems="center">
            <Switch
              id="sync-to-google-drive"
              isChecked={settings?.syncToGoogleDrive}
              onChange={handleToggleSyncToGoogleDrive}
            />
            <FormLabel htmlFor="sync-to-google-drive" mb={0} ml={2}>
              Sync to Google Drive
            </FormLabel>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Switch id="show-qr-codes" isChecked={settings?.showQRCode} onChange={handleToggleShowQRCode} />
            <FormLabel htmlFor="show-qr-codes" mb={0} ml={2}>
              Show QR codes
            </FormLabel>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Switch
              id="show-countdown-timer"
              isChecked={settings?.showCountdownTimer}
              onChange={handleToggleShowCountdownTimer}
            />
            <FormLabel htmlFor="show-countdown-timer" mb={0} ml={2}>
              Show countdown timer
            </FormLabel>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <Switch id="show-counts" isChecked={settings?.showCounts} onChange={handleToggleShowCounts} />
            <FormLabel htmlFor="show-counts" mb={0} ml={2}>
              Show counts in menu
            </FormLabel>
          </FormControl>
        </VStack>

        {(settings?.syncToGoogleDrive ?? false) && <SyncInfoPanel />}
      </HStack>
    </>
  );
}
