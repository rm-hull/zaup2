import { Button, Dialog, HStack, Field, Image, Input, Portal, CloseButton } from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { PropsWithChildren, type JSX } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface FaviconDialogProps {
  url?: string;
  onUpdate: (favicon?: string) => void;
}
interface FaviconForm {
  favicon: string;
}

export function FaviconDialog({ children, url, onUpdate }: PropsWithChildren<FaviconDialogProps>): JSX.Element {
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
    <Dialog.Root size="md">
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add custom favicon</Dialog.Title>
            </Dialog.Header>
            <Formik initialValues={{ favicon: url ?? "" }} onSubmit={handleSubmit}>
              {({ isValid }) => (
                <Form>
                  <Dialog.Body>
                    <FormikField name="favicon">
                      {({ field, form, meta }: FieldProps) => (
                        <Field.Root invalid={form.errors.favicon !== undefined && !!form.touched.favicon}>
                          <Input {...field} id="favicon" type="text" color={color} bg={bg} />
                          <Field.HelperText>
                            <HStack mt={1}>
                              Preview:
                              <Image src={field.value == "" ? null : field.value} h={5} />
                            </HStack>
                          </Field.HelperText>
                          <Field.ErrorText>
                            <Field.ErrorIcon size="xs" /> {meta.error}
                          </Field.ErrorText>
                        </Field.Root>
                      )}
                    </FormikField>
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="ghost">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit" colorPalette="blue" disabled={!isValid}>
                      {url === undefined ? "Add" : "Update"}
                    </Button>
                  </Dialog.Footer>

                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Form>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
