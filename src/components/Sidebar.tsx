import { Box, useDisclosure } from "@chakra-ui/react";
import { type ReactNode } from "react";
import MobileNav from "./MobileNav";
import SidebarContent from "./SidebarContent";
import { useColorModeValue } from "@/components/ui/color-mode";
import { DrawerContent, DrawerRoot } from "./ui/drawer";

export default function Sidebar({ children }: { children: ReactNode }) {
  const { open, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent onClose={onClose} display={{ base: "none", md: "block" }} />
      <DrawerRoot
        open={open}
        placement="start"
        // onClose={onClose}
        // returnFocusOnClose={false}
        // onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </DrawerRoot>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}
