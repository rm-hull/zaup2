import { Flex, type FlexProps, IconButton, Text } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useColorModeValue } from "./ui/color-mode";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export default function MobileNav({ onOpen, ...rest }: MobileProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton variant="outline" onClick={onOpen} aria-label="open menu">
        <FiMenu />
      </IconButton>

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        ZAUP2
      </Text>
    </Flex>
  );
}
