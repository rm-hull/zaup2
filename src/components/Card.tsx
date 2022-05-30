import {
  Box,
  Center,
  Heading,
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
import React from "react";
import { FiActivity, FiCheck, FiClipboard } from "react-icons/fi";
import { getFavicon } from "../favicons";
import { getEncodedSecret, getTotp } from "../otp";
import { OTP } from "../types";
import HashTag from "./HashTag";

type CardProps = {
  otp: OTP;
  refresh?: number;
  showQRCode?: boolean;
  enableNotifications?: boolean;
  onNotify?: () => void;
};

const Card = React.memo(({ otp, showQRCode, enableNotifications, onNotify }: CardProps): JSX.Element => {
  const encodedSecret = React.useMemo(() => getEncodedSecret(otp), [otp]);
  const totp = React.useMemo(() => getTotp(otp, encodedSecret), [otp, encodedSecret]);

  const code = totp!.generate();
  const { hasCopied, onCopy } = useClipboard(code);

  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const color = useColorModeValue("black", "white");
  const tagBg = useColorModeValue("gray.50", "gray.800");

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
          <Text fontWeight={600} color="gray.500" mb={4}>
            {otp.label ?? otp.issuer}
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
          {enableNotifications && (
            <Tooltip label="Notify">
              <IconButton aria-label="Notify" onClick={onNotify} icon={<FiActivity />} />
            </Tooltip>
          )}
          <Heading fontSize="5xl" fontFamily="body">
            {code}
          </Heading>
          <Tooltip label="Copy to Clipboard">
            <IconButton
              aria-label="Copy to clipboard"
              onClick={onCopy}
              icon={hasCopied ? <FiCheck color="green" /> : <FiClipboard />}
            />
          </Tooltip>
        </Stack>

        <Tooltip label={otp.name}>
          <Text fontWeight={600} color="gray.500" mb={4} noOfLines={1}>
            {otp.name}
          </Text>
        </Tooltip>

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
