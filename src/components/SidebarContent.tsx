import { Box, type BoxProps, CloseButton, Flex, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import * as R from "ramda";
import { useMemo } from "react";
import { FiCompass, FiHome, FiLogIn, FiMessageSquare, FiSettings, FiTag } from "react-icons/fi";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { getSystemTags } from "../otp";
import CountdownTimer from "./CountdownTimer";
import NavItem from "./NavItem";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export default function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const { data = [] } = useOtpParameters();
  const [settings] = useGeneralSettings();

  const issuers = useMemo(
    () => R.sortBy(R.toLower, R.uniq(data.map((otp) => otp.label ?? otp.issuer ?? "Unknown"))),
    [data]
  );
  const tags = useMemo(() => R.sortBy(R.toLower, R.uniq(data.flatMap((otp) => otp.tags ?? []))), [data]);
  const systemTags = useMemo(() => R.sortBy(R.toLower, R.uniq(data.flatMap(getSystemTags))), [data]);

  const subMenuColor = useColorModeValue("blue.600", "blue.200");

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
      <VStack gap={0} h="full" justifyContent="space-between">
        <Box w="full">
          <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
              ZAUP2
            </Text>
            <HStack gap={1}>
              <ColorModeButton />
              <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </HStack>
          </Flex>
          <NavItem label="Home" icon={FiHome} path="/" />
          <NavItem
            label="Tags"
            icon={FiTag}
            count={settings?.showCounts === true ? systemTags.length + tags.length : undefined}
          >
            <Box w="full">
              <VStack
                ml={8}
                alignItems="flex-start"
                w="full"
                maxHeight="45vh"
                overflowY="scroll"
                gap={0}
                overflowX="hidden"
              >
                {systemTags.map((tag) => (
                  <NavItem
                    key={tag}
                    label={`#${tag.toUpperCase()}`}
                    color={subMenuColor}
                    path={`/tags/${encodeURIComponent(tag)}`}
                    py={1}
                  />
                ))}
                {systemTags.length > 0 && tags.length > 0 && <Separator w={200} m={2} />}
                {tags.map((tag) => (
                  <NavItem
                    key={tag}
                    label={`#${tag.toUpperCase()}`}
                    color={subMenuColor}
                    path={`/tags/${encodeURIComponent(tag)}`}
                    py={1}
                  />
                ))}
              </VStack>
            </Box>
          </NavItem>
          <NavItem label="Issuers" icon={FiCompass} count={settings?.showCounts === true ? issuers.length : undefined}>
            <VStack ml={8} alignItems="flex-start" w="full" maxHeight="45vh" overflowY="scroll" gap={0}>
              {issuers.map((issuer) => (
                <NavItem
                  key={issuer}
                  label={issuer ?? "«Unknown»"}
                  color={subMenuColor}
                  path={`/issuers/${encodeURIComponent(issuer ?? "«Unknown»")}`}
                  py={1}
                />
              ))}
            </VStack>
          </NavItem>
          <NavItem label="Import" icon={FiLogIn} path="/import" />
          <NavItem label="Settings" icon={FiSettings} path="/settings" />
          <NavItem label="About" icon={FiMessageSquare} path="/about" />
        </Box>
        {(settings?.showCountdownTimer ?? false) && (
          <Box pb={12}>
            <CountdownTimer duration={30} />
          </Box>
        )}
      </VStack>
    </Box>
  );
}
