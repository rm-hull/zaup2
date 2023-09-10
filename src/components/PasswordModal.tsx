import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";

type PasswordModalProps = {
  isOpen: boolean;
  confirm: boolean;
  onSubmit: (password: string) => void;
};

type PasswordForm = {
  password: string;
  confirmedPassword: string;
};

const requiredValidator = (value: string) => {
  let error;
  if (value.trim().length === 0) {
    error = "Required";
  }
  return error;
};

export function PasswordModal({ isOpen, confirm, onSubmit }: PasswordModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");

  const handleAdd = (form: PasswordForm, actions: FormikHelpers<PasswordForm>) => {
    try {
      onSubmit(form.password.trim());
    } finally {
      actions.setSubmitting(false);
    }
  };

  const formValidator = (form: PasswordForm) => {
    if (confirm && form.password !== form.confirmedPassword) {
      return { confirmedPassword: "Passwords do not match" };
    }
    return {};
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter your password</ModalHeader>
        <Formik
          initialValues={{ password: "", confirmedPassword: "" }}
          onSubmit={handleAdd}
          validate={formValidator}
          validateOnChange
        >
          {({ errors }) => (
            <Form>
              <ModalBody>
                <Field name="password" validate={requiredValidator}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.password !== undefined && !!form.touched.password}>
                      <Input
                        {...field}
                        placeholder="Password"
                        id="password"
                        type="password"
                        color={color}
                        bg={bg}
                        border={0}
                        _focus={{
                          bg: focusBg,
                          outline: "none",
                        }}
                      />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
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
                        <Input
                          {...field}
                          placeholder="Re-enter password to confirm"
                          id="confirmedPassword"
                          type="password"
                          color={color}
                          bg={bg}
                          border={0}
                          _focus={{
                            bg: focusBg,
                            outline: "none",
                          }}
                        />
                        <FormErrorMessage>{form.errors.confirmedPassword}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  bg="blue.400"
                  color="white"
                  _hover={{ bg: "blue.500" }}
                  _focus={{ bg: "blue.500" }}
                  disabled={!!errors}
                >
                  Ok
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
