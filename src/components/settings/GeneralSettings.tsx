import {
  Alert,
  AlertDescription,
  AlertTitle,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { googleLogout } from "@react-oauth/google";
import { type JSX } from "react";
import useAccessToken from "../../hooks/useAccessToken";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";
import usePassword from "../../hooks/usePassword";
import { type sortBy } from "../../otp";
import GoogleDriveSettings from "./GoogleDriveSettings";
import ResetDataButton from "./ResetDataButton";

export default function GeneralSettings(): JSX.Element {
  const { removeAll } = useOtpParameters({ includeArchived: true });
  const [settings, updateSettings] = useGeneralSettings();
  const [, setPassword] = usePassword();
  const [accessToken, setAccessToken] = useAccessToken();

  const handleToggleSyncToGoogleDrive = (): void => {
    updateSettings({ ...settings, syncToGoogleDrive: !(settings?.syncToGoogleDrive ?? false) });
    if (accessToken !== undefined) {
      googleLogout();
      setAccessToken(undefined);
    }
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

  const handleResetData = (): void => {
    removeAll();
    updateSettings(undefined);
    setPassword(undefined);
  };

  return (
    <>
      <Heading size="md">General Settings</Heading>

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

        {(settings?.syncToGoogleDrive ?? false) && <GoogleDriveSettings />}
      </HStack>

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="sort-order" mb={0}>
          Sort by:
        </FormLabel>
        <RadioGroup id="sort-order" onChange={handleUpdateSortOrder} value={settings?.sortOrder}>
          <Stack direction="row">
            <Radio value="name">name</Radio>
            <Radio value="lastUsed">last used</Radio>
            <Radio value="mostUsed">most used</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      <Alert status="error" variant="left-accent" flexDirection="column" alignItems="start">
        <AlertTitle mb={1} fontSize="lg">
          Danger Zone
        </AlertTitle>
        <AlertDescription mb={3}>
          The operations in this section are destructive and not recoverable. Ensure that you definitely want proceed,
          as there is no way to subsequently revert any completed operations.
        </AlertDescription>
        <ResetDataButton onResetRequested={handleResetData} />
      </Alert>
    </>
  );
}
