import {
  Box,
  Center,
  HStack,
  Heading,
  Highlight,
  IconButton,
  Image,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { type TOTP } from "otpauth";
import { QRCodeSVG } from "qrcode.react";
import { memo, useEffect, useMemo, type JSX } from "react";
import { FiAlertTriangle, FiCheck, FiClipboard } from "react-icons/fi";
import { getCachedFavicon } from "../favicons";
import useOtpParameters from "../hooks/useOtpParameters";
import { getEncodedSecret, getTotp } from "../otp";
import { type OTP } from "../types";
import HashTag from "./HashTag";
import SystemTags from "./SystemTags";
import * as R from "ramda";

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

const Card = memo(({ otp, showQRCode, highlight }: CardProps): JSX.Element => {
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const totp = useMemo(() => getTotp(otp, encodedSecret), [otp, encodedSecret]);
  const { update } = useOtpParameters();

  const { code, error } = generateCode(totp);
  const { hasCopied, onCopy, setValue } = useClipboard("");
  useEffect(() => {
    setValue(code ?? "");
  }, [setValue, code]);

  const onCopyClicked = (): void => {
    setTimeout(() => {
      update({ ...otp, copyCount: (otp.copyCount ?? 0) + 1 });
    }, 2000);
    onCopy();
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
          <Text fontWeight={600} color="gray.500" noOfLines={1} wordBreak="break-all">
            <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }}>
              {otp.label ?? otp.issuer ?? "«Unknown»"}
            </Highlight>
          </Text>
        </HStack>

        {showQRCode === true && (
          <HStack align="center" justify="center" mt={4}>
            <QRCodeSVG
              size={256}
              value={`otpauth://totp/${otp.name}?secret=${encodedSecret}&issuer=${otp.issuer}`}
              fgColor={color}
              bgColor={bg}
            />
          </HStack>
        )}

        <HStack align="center" justify="center" mt={showQRCode === true ? 4 : 0}>
          <Heading fontSize="5xl" fontFamily="body">
            {code ?? "╰(°□°)╯"}
          </Heading>
          {code === undefined ? (
            <Tooltip label={`Error: ${error?.message}`}>
              <IconButton disabled aria-label="Could not generate code" icon={<FiAlertTriangle color="red" />} />
            </Tooltip>
          ) : (
            <Tooltip label="Copy to Clipboard">
              <IconButton
                aria-label="Copy to clipboard"
                onClick={onCopyClicked}
                icon={hasCopied ? <FiCheck color="green" /> : <FiClipboard />}
              />
            </Tooltip>
          )}
        </HStack>

        {!R.isEmpty(otp.name) && (
          <Tooltip label={otp.name}>
            <Text fontWeight={600} color="gray.500" mb={4} noOfLines={1} wordBreak="break-all">
              <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }}>
                {otp.name ?? ""}
              </Highlight>
            </Text>
          </Tooltip>
        )}

        <HStack align="center" justify="center" mt={4}>
          <Wrap justify="center">
            {otp.tags?.map((tag) => (
              <WrapItem key={tag}>
                <HashTag label={tag} bg={tagBg} />
              </WrapItem>
            ))}
            <SystemTags otp={otp} />
          </Wrap>
        </HStack>
      </Box>
    </Center>
  );
});

Card.displayName = "Card";

export default Card;
