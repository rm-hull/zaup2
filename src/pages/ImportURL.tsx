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
import React from "react";
import google_authenticator from "../assets/google_authenticator.svg";
import { MigrationPayload } from "../proto/migration_payload";

function validateURL(value: string) {
  let error;
  if (!value) {
    error = "Value is required";
  } else if (!value.startsWith("otpauth-migration://offline?data=")) {
    error = "Must be a Google Authenticator Migration URL";
  }
  return error;
}

type ImportForm = {
  url: string;
};

type ImportURLProps = {
  onSubmit: (otp_parameters: MigrationPayload.OtpParameters[]) => void;
};

export default function ImportURL({ onSubmit }: ImportURLProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");

  const handleImport = (values: ImportForm, actions: FormikHelpers<ImportForm>) => {
    try {
      const data = values.url.slice(33);
      const payload = MigrationPayload.deserialize(new BinaryReader(data));
      onSubmit(payload.otp_parameters);
    } catch (err) {
      if (err instanceof Error) {
        actions.setFieldError("url", `Unable to parse URL: ${err.message}`);
      } else {
        actions.setFieldError("url", `Unable to parse URL: Unknown error`);
      }
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" py={12}>
      <Stack boxShadow="2xl" bg={useColorModeValue("white", "gray.700")} rounded="xl" p={10} spacing={8} align="center">
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
                        rounded="full"
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
                  bg={"blue.400"}
                  rounded="full"
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
