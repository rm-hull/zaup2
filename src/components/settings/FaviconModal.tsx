import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  HStack,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { type JSX } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface FaviconModalProps {
  url?: string;
  open: boolean;
  onUpdate: (favicon?: string) => void;
  onCancel: () => void;
}
interface FaviconForm {
  favicon: string;
}

export function FaviconModal({ url, open, onUpdate, onCancel }: FaviconModalProps): JSX.Element {
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
    <DialogRoot open={open} onOpenChange={onCancel}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Add custom favicon</DialogHeader>
        <Formik initialValues={{ favicon: url ?? "" }} onSubmit={handleSubmit}>
          {({ isValid }) => (
            <Form>
              <DialogBody>
                <Field name="favicon">
                  {({ field, form, meta }: FieldProps) => (
                    <Field
                      isInvalid={form.errors.favicon !== undefined && !!form.touched.favicon}
                      errorText={meta.error}
                    >
                      <Input {...field} id="favicon" type="text" color={color} bg={bg} />
                      <HStack mt={1}>
                        <Text textStyle="xs" color="gray.500">
                          Preview:
                        </Text>
                        <Image src={field.value} h={5} />
                      </HStack>
                    </Field>
                  )}
                </Field>
              </DialogBody>

              <DialogFooter>
                <Button type="submit" colorScheme="blue" mr={3} disabled={!isValid}>
                  {url === undefined ? "Add" : "Update"}
                </Button>
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </DialogRoot>
  );
}
