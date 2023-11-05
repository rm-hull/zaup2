import useGeneralSettings from "../hooks/useGeneralSettings";
import usePassword from "../hooks/usePassword";
import { PasswordModal } from "./PasswordModal";

type PasswordProtectionProps = object;

export default function PasswordProtection({
  children,
}: React.PropsWithChildren<PasswordProtectionProps>): JSX.Element {
  const [settings, updateSettings] = useGeneralSettings();
  const [password, setPassword] = usePassword();

  const handleSubmit = (enteredPassword: string) => {
    updateSettings({ ...settings, encrypted: true });
    setPassword(enteredPassword);
  };

  if (password !== undefined) {
    return <>{children}</>;
  }

  return <PasswordModal isOpen onSubmit={handleSubmit} confirm={!settings?.encrypted} />;
}
