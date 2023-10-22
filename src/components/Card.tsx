import {
  Box,
  Center,
  Heading,
  Highlight,
  IconButton,
  Image,
  Stack,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import QRCode from "qrcode.react";
import { memo, useEffect, useMemo } from "react";
import { FiCheck, FiClipboard } from "react-icons/fi";
import { getFavicon } from "../favicons";
import { getEncodedSecret, getTotp } from "../otp";
import { OTP } from "../types";
import HashTag from "./HashTag";
import useOtpParameters from "../hooks/useOtpParameters";

type CardProps = {
  otp: OTP;
  refresh?: number;
  showQRCode?: boolean;
  highlight?: string;
};

const Card = memo(({ otp, showQRCode, highlight }: CardProps): JSX.Element => {
  const encodedSecret = useMemo(() => getEncodedSecret(otp), [otp]);
  const totp = useMemo(() => getTotp(otp, encodedSecret), [otp, encodedSecret]);
  const { update } = useOtpParameters();

  const code = totp!.generate();
  const { hasCopied, onCopy, setValue } = useClipboard("");
  useEffect(() => setValue(code), [setValue, code]);

  const onCopyClicked = () => {
    setTimeout(() => update({ ...otp, copyCount: (otp.copyCount ?? 0) + 1 }), 2000);
    return onCopy();
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
        <Stack align="center" justify="center" direction="row" mt={4}>
          <Image src={getFavicon(otp)} h={5} />
          <Text fontWeight={600} color="gray.500">
            <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }}>
              {otp.label || otp.issuer || "«Unknown»"}
            </Highlight>
          </Text>
        </Stack>

        {showQRCode && (
          <Stack align="center" justify="center" direction="row" mt={4}>
            <QRCode
              renderAs="canvas"
              size={256}
              value={`otpauth://totp/${otp.name}?secret=${encodedSecret}&issuer=${otp.issuer}`}
              fgColor={color}
              bgColor={bg}
            />
          </Stack>
        )}

        <Stack align="center" justify="center" direction="row" mt={showQRCode ? 4 : 0}>
          <Heading fontSize="5xl" fontFamily="body">
            {code}
          </Heading>
          <Tooltip label="Copy to Clipboard">
            <IconButton
              aria-label="Copy to clipboard"
              onClick={onCopyClicked}
              icon={hasCopied ? <FiCheck color="green" /> : <FiClipboard />}
            />
          </Tooltip>
        </Stack>

        {otp.name && (
          <Tooltip label={otp.name}>
            <Text fontWeight={600} color="gray.500" mb={4} noOfLines={1}>
              <Highlight query={highlight ?? ""} styles={{ bg: highlightBg }}>
                {otp.name}
              </Highlight>
            </Text>
          </Tooltip>
        )}

        <Stack align="center" justify="center" direction="row" mt={4}>
          <Wrap>
            {otp.tags?.map((tag) => (
              <WrapItem key={tag}>
                <HashTag label={tag} bg={tagBg} />
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      </Box>
    </Center>
  );
});

Card.displayName = "Card";

export default Card;
