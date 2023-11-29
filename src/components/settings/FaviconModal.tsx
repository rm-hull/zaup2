import {
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  HStack,
  Image,
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
import { ErrorMessage, Field, type FieldProps, Form, Formik, type FormikHelpers } from "formik";

interface FaviconModalProps {
  url?: string;
  isOpen: boolean;
  onUpdate: (favicon?: string) => void;
  onCancel: () => void;
}
interface FaviconForm {
  favicon: string;
}

export function FaviconModal({ url, isOpen, onUpdate, onCancel }: FaviconModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");

  const handleSubmit = (values: FaviconForm, actions: FormikHelpers<FaviconForm>): void => {
    try {
      onUpdate(values.favicon.trim().length === 0 ? undefined : values.favicon.trim());
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add custom favicon</ModalHeader>
        <Formik initialValues={{ favicon: url ?? "" }} onSubmit={handleSubmit}>
          {({ isValid }) => (
            <Form>
              <ModalBody>
                <Field name="favicon">
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.favicon !== undefined && !!form.touched.favicon}>
                      <Input {...field} id="favicon" type="text" color={color} bg={bg} />
                      <FormErrorMessage>
                        <FormErrorIcon />
                        <ErrorMessage name="favicon" />
                      </FormErrorMessage>
                      <HStack mt={1}>
                        <Text size="xs" color="gray.500">
                          Preview:
                        </Text>
                        <Image src={field.value} h={5} />
                      </HStack>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3} disabled={!isValid}>
                  {url === undefined ? "Add" : "Update"}
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
