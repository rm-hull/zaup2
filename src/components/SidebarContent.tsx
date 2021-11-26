import { Box, BoxProps, CloseButton, Flex, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiLogIn, FiSettings, FiTag } from "react-icons/fi";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import CountdownTimer from "./CountdownTimer";
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
      <VStack spacing={0} h="full" justifyContent="space-between">
        <Box w="full">
          <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              ZAUP2
            </Text>
            <HStack spacing={1}>
              <ColorModeSwitcher />
              <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </HStack>
          </Flex>
          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon} path={link.path}>
              {link.name}
            </NavItem>
          ))}
        </Box>
        <Box pb={12}>
          <CountdownTimer duration={30} />
        </Box>
      </VStack>
    </Box>
  );
}
