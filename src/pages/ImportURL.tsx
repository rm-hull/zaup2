import {
  Alert,
  chakra,
  Collapsible,
  Flex,
  Field,
  Heading,
  Link,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikErrors, type FormikHelpers } from "formik";
import { BinaryReader } from "google-protobuf";
import * as OTPAuth from "otpauth";

import google_authenticator from "../assets/google_authenticator.svg";
import QrScannerButton from "../components/import/QrScannerButton";
import { algorithmFrom } from "../otp";
import { MigrationPayload } from "../proto/migration_payload";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

function validateURL(value: string | undefined): string | undefined {
  if (value === undefined || value === null) {
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
      return `Unknown error: ${(err as Error).message}`;
    }
  }
  return undefined;
}

interface ImportForm {
  url: string;
}

interface ImportURLProps {
  onSubmit: (otp_parameters: MigrationPayload.OtpParameters[]) => void;
}

type SetFieldValueType<Values> = (
  field: string,
  value: unknown,
  shouldValidate?: boolean
) => Promise<FormikErrors<Values> | void>;

export function ImportURL({ onSubmit }: ImportURLProps) {
  const { open, onClose } = useDisclosure({ defaultOpen: true });
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");

  const handleImport = (values: ImportForm, actions: FormikHelpers<ImportForm>): void => {
    try {
      const parsed = OTPAuth.URI.parse(decodeURIComponent(values.url));
      onSubmit([
        new MigrationPayload.OtpParameters({
          name: parsed.label,
          issuer: parsed.issuer,
          secret: new Uint8Array(parsed.secret.buffer),
          algorithm: algorithmFrom(parsed.algorithm),
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
          return;
        } catch (err) {
          if (err instanceof Error) {
            actions.setFieldError("url", `Unable to parse URL: ${err.message}`);
            return;
          }
        }
      }
      console.error(err);
      actions.setFieldError("url", `Unable to parse URL: Unknown error`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const randomSecret = (length: number): Uint8Array => {
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    // Ensure values are within the basic Latin-1 codepage, A-Z only
    for (let i = 0; i < randomValues.length; i++) {
      randomValues[i] = (randomValues[i] % 26) + 65;
    }
    return randomValues;
  };

  const addDummyOtpCodes = (setFieldValue: SetFieldValueType<ImportForm>) => async () => {
    const payload = MigrationPayload.fromObject({
      otp_parameters: [
        {
          name: "github.com/dummy1",
          issuer: "GitHub",
          type: MigrationPayload.OtpType.OTP_TYPE_TOTP,
          digits: MigrationPayload.DigitCount.DIGIT_COUNT_SIX,
          algorithm: MigrationPayload.Algorithm.ALGORITHM_SHA1,
          secret: randomSecret(20),
        },
        {
          name: "dummy2@example.com",
          issuer: "Google",
          type: MigrationPayload.OtpType.OTP_TYPE_TOTP,
          digits: MigrationPayload.DigitCount.DIGIT_COUNT_SIX,
          algorithm: MigrationPayload.Algorithm.ALGORITHM_SHA1,
          secret: randomSecret(20),
        },
        {
          name: "dummy3@example.com",
          issuer: "microsoft.com",
          type: MigrationPayload.OtpType.OTP_TYPE_TOTP,
          digits: MigrationPayload.DigitCount.DIGIT_COUNT_SIX,
          algorithm: MigrationPayload.Algorithm.ALGORITHM_SHA1,
          secret: randomSecret(20),
        },
      ],
    }).serialize();
    const decoder = new TextDecoder("utf8");
    const b64 = btoa(decoder.decode(payload));
    await setFieldValue("url", "otpauth-migration://offline?data=" + b64);

    onClose();
    toaster.dismiss();
    toaster.create({
      title: "Ok, I just created some dummy OTP Codes.",
      description: `Now just hit the Import button...`,
      type: "success",
      duration: 9000,
      closable: true,
    });
  };

  const addScannedQrCode = (setFieldValue: SetFieldValueType<ImportForm>) => async (url: string) => {
    await setFieldValue("url", url);

    toaster.dismiss();
    toaster.create({
      title: "Ok, your QR code was successfully scanned.",
      description: `Now just hit the Import button...`,
      type: "success",
      duration: 9000,
      closable: true,
    });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" py={12}>
      <Stack boxShadow="2xl" bg={useColorModeValue("white", "gray.800")} rounded="xl" p={10} gap={8} align="center">
        <chakra.img src={google_authenticator} h={24} w={24} />
        <Stack align="center" gap={2}>
          <Heading textTransform="uppercase" fontSize="3xl" color={useColorModeValue("gray.800", "gray.200")}>
            Import
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Import OTP codes from Google Authenticator
          </Text>
        </Stack>
        <Formik initialValues={{ url: "" }} onSubmit={handleImport} validateOnChange>
          {({ isSubmitting, values, setFieldValue, isValid }) => (
            <>
              <Form>
                <Stack gap={4} direction={{ base: "column", md: "row" }} w="500px" alignItems="start">
                  <FormikField name="url" validate={validateURL}>
                    {({ field, form, meta }: FieldProps) => (
                      <Field.Root invalid={form.errors.url !== undefined && !!form.touched.url}>
                        <Textarea
                          {...field}
                          id="url"
                          resize="vertical"
                          placeholder="otpauth-migration://offline?data=CjkKCjpG..."
                          color={color}
                          bg={bg}
                          minHeight={200}
                        />
                        <Field.ErrorText>
                          <Field.ErrorIcon size="xs" /> {meta.error}
                        </Field.ErrorText>
                      </Field.Root>
                    )}
                  </FormikField>

                  <VStack alignItems="flex-start">
                    <QrScannerButton onScanResult={addScannedQrCode(setFieldValue)} />

                    <Button
                      loading={isSubmitting}
                      type="submit"
                      colorPalette="blue"
                      flex="1 0 auto"
                      disabled={!isValid}
                    >
                      Import
                    </Button>
                  </VStack>
                </Stack>
              </Form>
              <Collapsible.Root open={open || values.url.trim().length === 0}>
                <Collapsible.Content>
                  <Alert.Root status="info">
                    <Alert.Indicator />
                    <Alert.Title>Just want to try it out?</Alert.Title>
                    <Alert.Description>
                      Add some dummy{" "}
                      <Link onClick={addDummyOtpCodes(setFieldValue)} color="blue.400">
                        test OTP codes
                      </Link>
                      .
                    </Alert.Description>
                  </Alert.Root>
                </Collapsible.Content>
              </Collapsible.Root>
            </>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
}
