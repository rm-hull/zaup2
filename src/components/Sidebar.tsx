import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { type JSX, type ReactNode } from "react";
import MobileNav from "./MobileNav";
import SidebarContent from "./SidebarContent";

export default function Sidebar({ children }: { children: ReactNode }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={onClose} display={{ base: "none", md: "block" }} />
      <Drawer
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}
