import { Box, BoxProps, CloseButton, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiLogIn, FiSettings, FiTag } from "react-icons/fi";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import NavItem from "./NavItem";

interface LinkItemProps {
  name: string;
  path: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", path: "/", icon: FiHome },
  { name: "Tags", path: "/tags/trending", icon: FiTag },
  { name: "Issuers", path: "/issuers", icon: FiCompass },
  { name: "Import", path: "/import", icon: FiLogIn },
  { name: "Settings", path: "/settings", icon: FiSettings },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export default function SidebarContent({ onClose, ...rest }: SidebarProps): JSX.Element {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <HStack spacing={0}>
          <Logo h="6" pointerEvents="none" animation={undefined} />
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            AUP2
          </Text>
        </HStack>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        <ColorModeSwitcher />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}
