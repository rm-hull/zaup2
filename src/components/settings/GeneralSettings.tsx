import {
  Alert,
  AlertDescription,
  AlertTitle,
  FormControl,
  FormLabel,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { type JSX } from "react";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";
import usePassword from "../../hooks/usePassword";
import { type sortBy } from "../../otp";
import ResetDataButton from "./ResetDataButton";

export default function GeneralSettings(): JSX.Element {
  const { removeAll } = useOtpParameters({ includeArchived: true });
  const [settings, updateSettings] = useGeneralSettings();
  const [, setPassword] = usePassword();

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
