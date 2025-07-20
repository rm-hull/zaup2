import { Field, HStack, Heading, VStack } from "@chakra-ui/react";
import { Radio, RadioGroup } from "../../components/ui/radio";
import { Switch } from "../../components/ui/switch";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import { type sortBy } from "../../otp";
import SyncInfoPanel from "./SyncInfoPanel";

export default function GeneralSettings() {
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

      <Field.Root display="flex" flexDirection="row" gap={4}>
        <Field.Label htmlFor="sort-order" mb={0}>
          Sort grid by:
        </Field.Label>
        <RadioGroup
          id="sort-order"
          onValueChange={(e) => handleUpdateSortOrder(e.value as keyof typeof sortBy)} // yuk
          value={settings?.sortOrder}
          colorPalette="blue"
        >
          <HStack gap={4}>
            <Radio value="name">name</Radio>
            <Radio value="lastUsed">last used</Radio>
            <Radio value="mostUsed">most used</Radio>
          </HStack>
        </RadioGroup>
      </Field.Root>

      <HStack alignItems="flex-start">
        <VStack gap={4} minWidth={250}>
          <Field.Root display="flex" flexDirection="row">
            <Switch
              checked={settings?.syncToGoogleDrive}
              onChange={handleToggleSyncToGoogleDrive}
              colorPalette="blue"
            />
            <Field.Label mb={0} ml={2}>
              Sync to Google Drive
            </Field.Label>
          </Field.Root>

          <Field.Root display="flex" flexDirection="row">
            <Switch checked={settings?.showQRCode} onChange={handleToggleShowQRCode} colorPalette="blue" />
            <Field.Label mb={0} ml={2}>
              Show QR codes
            </Field.Label>
          </Field.Root>

          <Field.Root display="flex" flexDirection="row">
            <Switch
              checked={settings?.showCountdownTimer}
              onChange={handleToggleShowCountdownTimer}
              colorPalette="blue"
            />
            <Field.Label mb={0} ml={2}>
              Show countdown timer
            </Field.Label>
          </Field.Root>

          <Field.Root display="flex" flexDirection="row">
            <Switch checked={settings?.showCounts} onChange={handleToggleShowCounts} colorPalette="blue" />
            <Field.Label mb={0} ml={2}>
              Show counts in menu
            </Field.Label>
          </Field.Root>
        </VStack>

        {(settings?.syncToGoogleDrive ?? false) && <SyncInfoPanel />}
      </HStack>
    </>
  );
}
