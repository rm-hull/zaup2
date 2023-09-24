import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from "formik";

type CustomLabelModalProps = {
  label?: string;
  isOpen: boolean;
  onUpdate: (label?: string) => void;
  onCancel: () => void;
};
type CustomLabelForm = {
  label: string;
};

export function CustomLabelModal({ label, isOpen, onUpdate, onCancel }: CustomLabelModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");

  const handleAdd = (values: CustomLabelForm, actions: FormikHelpers<CustomLabelForm>) => {
    try {
      onUpdate(values.label.trim().length === 0 ? undefined : values.label.trim());
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set a custom label</ModalHeader>
        <Formik initialValues={{ label: label ?? "" }} onSubmit={handleAdd}>
          {() => (
            <Form>
              <ModalBody>
                <Field name="label">
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.label !== undefined && !!form.touched.label}>
                      <Input
                        {...field}
                        id="label"
                        type="text"
                        color={color}
                        bg={bg}
                        border={0}
                        _focus={{
                          bg: focusBg,
                          outline: "none",
                        }}
                      />
                      <FormErrorMessage>
                        <FormErrorIcon />
                        <ErrorMessage name="label" />
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Text size="xs" color="gray.500">
                  <strong>Note:</strong> this label will override the issuer when the card is displayed.
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="submit"
                  bg="blue.400"
                  color="white"
                  _hover={{ bg: "blue.500" }}
                  _focus={{ bg: "blue.500" }}
                  mr={3}
                >
                  {label ? "Update" : "Add"}
                </Button>
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
