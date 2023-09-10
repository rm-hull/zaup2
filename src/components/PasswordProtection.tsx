import { useDisclosure } from "@chakra-ui/react";
import useGeneralSettings from "../hooks/useGeneralSettings";
import { useEffect } from "react";
import { PasswordModal } from "./PasswordModal";
import usePassword from "../hooks/usePassword";

type PasswordProtectionProps = object;

export default function PasswordProtection({
  children,
}: React.PropsWithChildren<PasswordProtectionProps>): JSX.Element {
  const [settings, updateSettings] = useGeneralSettings();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = usePassword();

  useEffect(onOpen, [onOpen]);

  const handleSubmit = (enteredPassword: string) => {
    updateSettings({ ...settings, encrypted: true });
    setPassword(enteredPassword);
    onClose();
  };

  if (password !== undefined) {
    return <>{children}</>;
  }

  return <PasswordModal isOpen={isOpen} onSubmit={handleSubmit} confirm={!settings?.encrypted} />;
}
