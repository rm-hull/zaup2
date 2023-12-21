import { Alert, AlertDescription, AlertTitle } from "@chakra-ui/react";
import { type JSX } from "react";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";
import usePassword from "../../hooks/usePassword";
import ResetDataButton from "./ResetDataButton";

export default function GeneralSettings(): JSX.Element {
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
