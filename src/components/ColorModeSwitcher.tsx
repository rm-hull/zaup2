import { IconButton, type IconButtonProps } from "@chakra-ui/react";
import type React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      aria-label={`Switch to ${text} mode`}
      {...props}
    >
      <SwitchIcon />
    </IconButton>
  );
};
