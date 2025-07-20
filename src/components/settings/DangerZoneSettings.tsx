import { Alert } from "@chakra-ui/react";

import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";
import usePassword from "../../hooks/usePassword";

import ResetDataButton from "./ResetDataButton";

export default function GeneralSettings() {
  const { removeAll } = useOtpParameters({ includeArchived: true });
  const [, updateSettings] = useGeneralSettings();
  const [, setPassword] = usePassword();

  const handleResetData = (): void => {
    removeAll();
    updateSettings(undefined);
    setPassword(undefined);
  };

  return (
    <>
      <Alert.Root status="error" flexDirection="column" alignItems="start">
        <Alert.Title mb={1} fontSize="lg">
          Danger Zone
        </Alert.Title>
        <Alert.Description mb={3}>
          The operations in this section are destructive and not recoverable. Ensure that you definitely want proceed,
          as there is no way to subsequently revert any completed operations.
        </Alert.Description>
        <ResetDataButton onResetRequested={handleResetData} />
      </Alert.Root>
    </>
  );
}
