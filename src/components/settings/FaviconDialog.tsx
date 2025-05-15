import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  HStack,
  Field,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { type JSX } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface FaviconDialogProps {
  url?: string;
  open: boolean;
  onUpdate: (favicon?: string) => void;
  onCancel: () => void;
}
interface FaviconForm {
  favicon: string;
}

export function FaviconDialog({ url, open, onUpdate, onCancel }: FaviconDialogProps): JSX.Element {
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
                <FormikField name="favicon">
                  {({ field, meta }: FieldProps) => (
                    <Field.Root>
                      <Input {...field} id="favicon" type="text" color={color} bg={bg} />
                      <Field.HelperText>
                        <HStack mt={1}>
                          Preview:
                          <Image src={field.value} h={5} />
                        </HStack>
                      </Field.HelperText>
                      <Field.ErrorText>{meta.error}</Field.ErrorText>
                    </Field.Root>
                  )}
                </FormikField>
              </DialogBody>

              <DialogFooter>
                <Button type="submit" colorPalette="blue" mr={3} disabled={!isValid}>
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
