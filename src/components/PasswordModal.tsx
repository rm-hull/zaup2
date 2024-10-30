import {
  Alert,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { type JSX } from "react";
import PasswordInput from "./PasswordInput";
import { useColorModeValue } from "@/components/ui/color-mode";

interface PasswordModalProps {
  open: boolean;
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

export function PasswordModal({ open, confirm, onSubmit }: PasswordModalProps): JSX.Element {
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
    <DialogRoot open={open} size="lg" onOpenChange={() => {}}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>{confirm ? "Create a new password" : "Enter your password"}</DialogHeader>
        <Formik
          initialValues={{ password: "", confirmedPassword: "" }}
          onSubmit={handleAdd}
          validate={formValidator}
          validateOnChange
        >
          {({ isValid }) => (
            <Form>
              <DialogBody>
                <Field name="password" validate={requiredValidator}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.password !== undefined && !!form.touched.password}>
                      <PasswordInput
                        {...field}
                        placeholder="Password"
                        id="password"
                        type="password"
                        color={color}
                        bg={bg}
                      />
                      <FormErrorMessage>
                        <FormErrorIcon />
                        <ErrorMessage name="password" />
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                {confirm && (
                  <Field name="confirmedPassword">
                    {({ field, form }: FieldProps) => (
                      <FormControl
                        isInvalid={form.errors.confirmedPassword !== undefined && !!form.touched.confirmedPassword}
                        mt={3}
                      >
                        <PasswordInput
                          {...field}
                          placeholder="Re-enter password to confirm"
                          id="confirmedPassword"
                          type="password"
                          color={color}
                          bg={bg}
                        />
                        <FormErrorMessage>
                          <FormErrorIcon />
                          <ErrorMessage name="confirmedPassword" />
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}
                {confirm && (
                  <Alert.Root mt={5} status="info" flexDirection="column" alignItems="start">
                    <Alert.Title mb={1} fontSize="lg">
                      Data Safety
                    </Alert.Title>
                    <Alert.Description>
                      The password you choose above will be used to store data securely using AES encryption. If you
                      loose or forget the password, any saved data will <strong>not</strong> be recoverable. Data is
                      never uploaded and stays on your machine in local storage only; note also that the password is
                      never stored.
                    </Alert.Description>
                  </Alert.Root>
                )}
              </DialogBody>

              <DialogFooter>
                <Button type="submit" colorScheme="blue" disabled={!isValid}>
                  Ok
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </DialogRoot>
  );
}
