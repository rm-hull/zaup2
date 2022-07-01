import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { BinaryReader } from "google-protobuf";
import * as OTPAuth from "otpauth";
import React from "react";
import google_authenticator from "../assets/google_authenticator.svg";
import { MigrationPayload } from "../proto/migration_payload";

function validateURL(value: string) {
  if (!value) {
    return "Value is required";
  }

  try {
    OTPAuth.URI.parse(decodeURIComponent(value));
  } catch (err) {
    if (err instanceof URIError) {
      if (!value.startsWith("otpauth-migration://offline?data=")) {
        return "Must be a Google Authenticator URL";
      }
      return undefined;
    } else {
      return `Unknown error: ${err}`;
    }
  }
  return undefined;
}

type ImportForm = {
  url: string;
};

type ImportURLProps = {
  onSubmit: (otp_parameters: MigrationPayload.OtpParameters[]) => void;
};

const getAlgorithm = (alg?: string): MigrationPayload.Algorithm => {
  switch (alg) {
    case "MD5":
      return MigrationPayload.Algorithm.ALGORITHM_MD5;
    case "SHA1":
      return MigrationPayload.Algorithm.ALGORITHM_SHA1;
    case "SHA256":
      return MigrationPayload.Algorithm.ALGORITHM_SHA256;
    case "SHA512":
      return MigrationPayload.Algorithm.ALGORITHM_SHA512;
    default:
      return MigrationPayload.Algorithm.ALGORITHM_UNSPECIFIED;
  }
};

export default function ImportURL({ onSubmit }: ImportURLProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");

  const handleImport = (values: ImportForm, actions: FormikHelpers<ImportForm>) => {
    try {
      const parsed = OTPAuth.URI.parse(decodeURIComponent(values.url));
      onSubmit([
        new MigrationPayload.OtpParameters({
          name: parsed.label,
          issuer: parsed.issuer,
          secret: new Uint8Array(parsed.secret.buffer),
          algorithm: getAlgorithm(parsed.algorithm),
          digits:
            parsed.digits === 6
              ? MigrationPayload.DigitCount.DIGIT_COUNT_SIX
              : MigrationPayload.DigitCount.DIGIT_COUNT_EIGHT,
          type:
            parsed instanceof OTPAuth.TOTP
              ? MigrationPayload.OtpType.OTP_TYPE_TOTP
              : MigrationPayload.OtpType.OTP_TYPE_HOTP,
        }),
      ]);
    } catch (err) {
      if (err instanceof URIError) {
        try {
          const data = decodeURIComponent(values.url).slice(33);
          const payload = MigrationPayload.deserialize(new BinaryReader(data));
          onSubmit(payload.otp_parameters);
        } catch (err) {
          if (err instanceof Error) {
            actions.setFieldError("url", `Unable to parse URL: ${err.message}`);
            return;
          }
        }
      }
      // eslint-disable-next-line no-console
      console.error(err);
      actions.setFieldError("url", `Unable to parse URL: Unknown error`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" py={12}>
      <Stack boxShadow="2xl" bg={useColorModeValue("white", "gray.800")} rounded="xl" p={10} spacing={8} align="center">
        <chakra.img src={google_authenticator} h={24} w={24} />
        <Stack align="center" spacing={2}>
          <Heading textTransform="uppercase" fontSize="3xl" color={useColorModeValue("gray.800", "gray.200")}>
            Import
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Import OTP codes from Google Authenticator
          </Text>
        </Stack>
        <Formik initialValues={{ url: "" }} onSubmit={handleImport}>
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={4} direction={{ base: "column", md: "row" }} w="500px">
                <Field name="url" validate={validateURL}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.url !== undefined && !!form.touched.url}>
                      <Input
                        {...field}
                        id="url"
                        type="text"
                        placeholder="otpauth-migration://offline?data=CjkKCjpG..."
                        color={color}
                        bg={bg}
                        border={0}
                        _focus={{
                          bg: focusBg,
                          outline: "none",
                        }}
                      />
                      <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  bg="blue.400"
                  color="white"
                  flex="1 0 auto"
                  _hover={{ bg: "blue.500" }}
                  _focus={{ bg: "blue.500" }}
                >
                  Import
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
}
