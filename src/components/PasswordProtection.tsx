import { type PropsWithChildren } from "react";
import useGeneralSettings from "../hooks/useGeneralSettings";
import usePassword from "../hooks/usePassword";
import { PasswordDialog } from "./PasswordDialog";

type PasswordProtectionProps = object;

export default function PasswordProtection({ children }: PropsWithChildren<PasswordProtectionProps>) {
  const [settings, updateSettings] = useGeneralSettings();
  const [password, setPassword] = usePassword();

  const handleSubmit = (enteredPassword: string): void => {
    updateSettings({ ...settings, encrypted: true });
    setPassword(enteredPassword);
  };

  if (password !== undefined) {
    return <>{children}</>;
  }

  return <PasswordDialog onSubmit={handleSubmit} confirm={!(settings?.encrypted ?? false)} />;
}
