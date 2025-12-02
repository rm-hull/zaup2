import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Highlight,
  IconButton,
  Image,
  QrCode,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { type TOTP } from "otpauth";
import * as R from "ramda";
import { memo, useMemo } from "react";
import { FiAlertTriangle, FiCheck, FiClipboard } from "react-icons/fi";
import { getCachedFavicon } from "../favicons";
import useOtpParameters from "../hooks/useOtpParameters";
import { getEncodedSecret, getTotp } from "../otp";
import { type OTP } from "../types";
import HashTag from "./HashTag";
import SystemTags from "./SystemTags";
import { useColorModeValue } from "./ui/color-mode";
import { Tooltip } from "./ui/tooltip";

interface CardProps {
  otp: OTP;
  refresh?: number;
  showQRCode?: boolean;
  highlight?: string;
}

function generateCode(totp?: TOTP): Partial<{ code: string; error: Error }> {
  try {
    return { code: totp?.generate() };
  } catch (err) {
    return { error: err as Error };
  }
}

const Card = memo(({ otp, showQRCode, highlight }: CardProps) => {
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const totp = getTotp(otp, encodedSecret);
  const { update } = useOtpParameters();

  const { code, error } = generateCode(totp);
  const { copied, copy } = useClipboard({ value: code });

  const onCopyClicked = (): void => {
    setTimeout(() => {
      update({ ...otp, copyCount: (otp.copyCount ?? 0) + 1 });
    }, 2000);
    copy();
  };

  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const color = useColorModeValue("black", "white");
  const tagBg = useColorModeValue("gray.50", "gray.800");
  const highlightBg = useColorModeValue("orange.100", "orange.500");

  return (
    <Center py={6}>
      <Box
        maxW="320px"
        w="full"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="2xl"
        rounded="lg"
        p={4}
        textAlign="center"
      >
        <HStack align="center" justify="center" mt={4}>
          <Image src={getCachedFavicon(otp)} h={5} />
          <Text fontWeight={600} color="gray.500" lineClamp={1} wordBreak="break-all">
            <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }} ignoreCase>
              {otp.label ?? otp.issuer ?? "«Unknown»"}
            </Highlight>
          </Text>
        </HStack>

        {showQRCode === true && (
          <HStack align="center" justify="center" mt={2}>
            <QrCode.Root
              size="full"
              value={`otpauth://totp/${otp.name}?secret=${encodedSecret}&issuer=${otp.issuer}`}
              color={color}
              bg={bg}
              px={2}
            >
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          </HStack>
        )}

        <HStack align="center" justify="center" mt={showQRCode === true ? 2 : 0}>
          <Heading fontSize="5xl" fontFamily="body">
            {code ?? "╰(°□°)╯"}
          </Heading>
          {code === undefined ? (
            <Tooltip showArrow content={`Error: ${error?.message}`}>
              <IconButton disabled aria-label="Could not generate code" variant="subtle">
                <FiAlertTriangle color="red" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip showArrow content="Copy to Clipboard">
              <IconButton aria-label="Copy to clipboard" onClick={onCopyClicked} variant="subtle">
                {copied ? <FiCheck color="green" /> : <FiClipboard />}
              </IconButton>
            </Tooltip>
          )}
        </HStack>

        {!R.isEmpty(otp.name) && (
          <Tooltip showArrow content={otp.name}>
            <Text fontWeight={600} color="gray.500" mb={4} lineClamp={1} wordBreak="break-all">
              <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }} ignoreCase>
                {otp.name ?? ""}
              </Highlight>
            </Text>
          </Tooltip>
        )}

        <HStack align="center" justify="center" mt={4}>
          <HStack wrap="wrap" justify="center">
            {otp.tags?.map((tag) => (
              <Flex key={tag} align="flex-start">
                <HashTag label={tag} bg={tagBg} />
              </Flex>
            ))}
            <SystemTags otp={otp} />
          </HStack>
        </HStack>
      </Box>
    </Center>
  );
});

Card.displayName = "Card";

export default Card;
