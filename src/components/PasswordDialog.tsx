import { Alert, Button, Dialog, Field, Input, Portal, Text, VStack } from "@chakra-ui/react";
import { type FieldProps, Form, Formik, Field as FormikField, type FormikHelpers } from "formik";
import PasswordInput from "./PasswordInput";
import { useColorModeValue } from "./ui/color-mode";

interface PasswordDialogProps {
  confirm: boolean;
  onSubmit: (password: string) => void;
}

interface PasswordForm {
  password: string;
  confirmedPassword: string;
}

const requiredValidator = (value: string): string | undefined => {
  let error;
  if (value.trim().length === 0) {
    error = "Required";
  }
  return error;
};

export function PasswordDialog({ confirm, onSubmit }: PasswordDialogProps) {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");

  const handleAdd = (form: PasswordForm, actions: FormikHelpers<PasswordForm>): void => {
    try {
      onSubmit(form.password.trim());
    } finally {
      actions.setSubmitting(false);
    }
  };

  const formValidator = (form: PasswordForm): Partial<PasswordForm> => {
    if (confirm && form.password !== form.confirmedPassword) {
      return { confirmedPassword: "Passwords do not match" };
    }
    return {};
  };

  return (
    <Dialog.Root open size="md">
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{confirm ? "Create a new password" : "Enter your password"}</Dialog.Title>
            </Dialog.Header>
            <Formik
              initialValues={{ password: "", confirmedPassword: "" }}
              onSubmit={handleAdd}
              validate={formValidator}
              validateOnChange
            >
              {({ isValid }) => (
                <Form>
                  <Input id="username" name="username" type="hidden" value="zaup2" autoComplete="username" />
                  <Dialog.Body>
                    <FormikField name="password" validate={requiredValidator}>
                      {({ field, form, meta }: FieldProps) => (
                        <Field.Root invalid={form.errors.password !== undefined && !!form.touched.password}>
                          <PasswordInput
                            {...field}
                            placeholder="Password"
                            id="password"
                            type="password"
                            autoComplete={confirm ? "new-password" : "current-password"}
                            color={color}
                            bg={bg}
                          />
                          <Field.ErrorText>
                            <Field.ErrorIcon size="xs" /> {meta.error}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    </FormikField>
                    {confirm && (
                      <FormikField name="confirmedPassword">
                        {({ field, form, meta }: FieldProps) => (
                          <Field.Root
                            mt={3}
                            invalid={form.errors.confirmedPassword !== undefined && !!form.touched.confirmedPassword}
                          >
                            <PasswordInput
                              {...field}
                              placeholder="Re-enter password to confirm"
                              id="confirmedPassword"
                              type="password"
                              autoComplete="new-password"
                              color={color}
                              bg={bg}
                            />

                            <Field.ErrorText>
                              <Field.ErrorIcon size="xs" /> {meta.error}
                            </Field.ErrorText>
                          </Field.Root>
                        )}
                      </FormikField>
                    )}
                    {confirm && (
                      <Alert.Root mt={5} status="info">
                        <Alert.Indicator />
                        <Alert.Content>
                          <Alert.Title mb={1} fontSize="lg">
                            Data Safety
                          </Alert.Title>
                          <Alert.Description>
                            <VStack>
                              <Text>
                                The password you choose above will be used to store data securely using AES encryption.
                                If you loose or forget the password, any saved data will <strong>not</strong> be
                                recoverable.
                              </Text>
                              <Text>
                                Data is never uploaded and stays on your machine in local storage only; note also that
                                the password is never stored either, it is only used to encrypt the OTP data.
                              </Text>
                            </VStack>
                          </Alert.Description>
                        </Alert.Content>
                      </Alert.Root>
                    )}
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Button type="submit" colorPalette="blue" disabled={!isValid}>
                      Ok
                    </Button>
                  </Dialog.Footer>
                </Form>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
