import { FormControl, FormLabel, HStack, Heading, Radio, RadioGroup, Switch, VStack, useToast } from "@chakra-ui/react";
import { type JSX, useEffect, useCallback } from "react";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import { type sortBy } from "../../otp";
import SyncInfoPanel from "./SyncInfoPanel";

export default function GeneralSettings(): JSX.Element {
  const [settings, updateSettings] = useGeneralSettings();
  const toast = useToast();

  const enableNotifications = useCallback(async () => {
    if (settings?.enableNotifications === true && Notification.permission !== "granted") {
      const reason = await Notification.requestPermission();
      if (reason === "denied") {
        toast({
          title: "Notifications are disabled",
          description: `You have disabled notifications for this site. Please enable them in your browser settings to use this feature.`, // TODO: More descriptive message
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
        updateSettings({ ...settings, enableNotifications: false });
      } else if (reason === "granted") {
        toast({
          title: "Notifications enabled",
          description: "Notifications have been enabled for this site.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        updateSettings({ ...settings, enableNotifications: false });
      }
    } else {
      // Handle 'default' state (user hasn't chosen yet)
      console.log("Notification permission is in the 'default' state.");
    }
  }, [toast, settings, updateSettings]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    enableNotifications().catch(console.error);
  }, [enableNotifications]);

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

  const handleToggleEnableNotifications = (): void => {
    updateSettings({ ...settings, enableNotifications: !(settings?.enableNotifications ?? false) });
  };

  return (
    <>
      <Heading size="md">General Settings</Heading>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="sort-order" mb={0}>
          Sort grid by:
        </FormLabel>
        <RadioGroup id="sort-order" onChange={handleUpdateSortOrder} value={settings?.sortOrder}>
          <HStack gap={4}>
            <Radio value="name">name</Radio>
            <Radio value="lastUsed">last used</Radio>
            <Radio value="mostUsed">most used</Radio>
          </HStack>
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

          <FormControl display="flex" alignItems="center">
            <Switch
              id="enable-notifications"
              isChecked={settings?.enableNotifications}
              onChange={handleToggleEnableNotifications}
            />
            <FormLabel htmlFor="enable-notifications" mb="0" ml={2}>
              Enable Notifications (WIP)
            </FormLabel>
          </FormControl>
        </VStack>

        {(settings?.syncToGoogleDrive ?? false) && <SyncInfoPanel />}
      </HStack>
    </>
  );
}
