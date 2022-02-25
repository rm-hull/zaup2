import {
  Badge,
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
} from "@chakra-ui/react";
import base32Encode from "base32-encode";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode.react";
import React from "react";
import { FiCheck, FiClipboard } from "react-icons/fi";
import { getFavicon } from "../favicons";
import { MigrationPayload } from "../proto/migration_payload";
import { OTP } from "../types";

type CardProps = {
  otp: OTP;
  refresh?: number;
  showQRCode?: boolean;
};

const getAlgorithm = (alg?: MigrationPayload.Algorithm) => {
  switch (alg) {
    case MigrationPayload.Algorithm.ALGORITHM_MD5:
      return "MD5";
    case MigrationPayload.Algorithm.ALGORITHM_SHA1:
      return "SHA1";
    case MigrationPayload.Algorithm.ALGORITHM_SHA256:
      return "SHA256";
    case MigrationPayload.Algorithm.ALGORITHM_SHA512:
      return "SHA512";
    default:
      return undefined;
  }
};

const getDigits = (digits?: MigrationPayload.DigitCount) => {
  switch (digits) {
    case MigrationPayload.DigitCount.DIGIT_COUNT_SIX:
      return 6;
    case MigrationPayload.DigitCount.DIGIT_COUNT_EIGHT:
      return 8;
    default:
      return undefined;
  }
};

const Card = React.memo(({ otp, showQRCode }: CardProps): JSX.Element => {
  const encodedSecret = React.useMemo(
    () => otp.secret && base32Encode(Uint8Array.from(Object.values(otp.secret)), "RFC4648"),
    [otp.secret]
  );
  const totp = React.useMemo(
    () =>
      new OTPAuth.TOTP({
        issuer: otp.issuer,
        label: otp.name,
        algorithm: getAlgorithm(otp.algorithm),
        digits: getDigits(otp.digits),
        period: 30,
        secret: encodedSecret,
      }),
    [otp, encodedSecret]
  );

  const code = totp.generate();
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
          <Text fontWeight={600} color="gray.500" mb={4} isTruncated>
            {otp.name}
          </Text>
        </Tooltip>

        <Stack align="center" justify="center" direction="row" mt={4}>
          {otp.tags?.map((tag) => (
            <Badge key={tag} px={2} py={1} bg={tagBg} fontWeight="400">
              #{tag}
            </Badge>
          ))}
        </Stack>
      </Box>
    </Center>
  );
});

Card.displayName = "Card";

export default Card;
