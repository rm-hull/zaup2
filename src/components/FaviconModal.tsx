import {
  Button,
  FormControl,
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
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";

type FaviconModalProps = {
  url?: string;
  isOpen: boolean;
  onUpdate: (favicon?: string) => void;
  onCancel: () => void;
};
type FaviconForm = {
  favicon: string;
};

export function FaviconModal({ url, isOpen, onUpdate, onCancel }: FaviconModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");

  const handleSubmit = (values: FaviconForm, actions: FormikHelpers<FaviconForm>) => {
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
        <ModalHeader>Set a favicon</ModalHeader>
        <Formik initialValues={{ favicon: url ?? "" }} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <ModalBody>
                <Field name="favicon">
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.favicon !== undefined && !!form.touched.favicon}>
                      <Input
                        {...field}
                        id="favicon"
                        type="text"
                        color={color}
                        bg={bg}
                        border={0}
                        placeholder="Favicon URL"
                        _focus={{
                          bg: focusBg,
                          outline: "none",
                        }}
                      />
                      <FormErrorMessage>{form.errors.favicon}</FormErrorMessage>
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
                <Button
                  type="submit"
                  bg="blue.400"
                  color="white"
                  _hover={{ bg: "blue.500" }}
                  _focus={{ bg: "blue.500" }}
                  mr={3}
                >
                  {url ? "Update" : "Add"}
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