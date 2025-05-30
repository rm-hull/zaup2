import { Button, Input, Field, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { PropsWithChildren, type JSX } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface CustomLabelDialogProps {
  label?: string;
  onUpdate: (label?: string) => void;
}
interface CustomLabelForm {
  label: string;
}

export function CustomLabelDialog({
  children,
  label,
  onUpdate,
}: PropsWithChildren<CustomLabelDialogProps>): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");

  const handleAdd = (values: CustomLabelForm, actions: FormikHelpers<CustomLabelForm>): void => {
    try {
      onUpdate(values.label.trim().length === 0 ? undefined : values.label.trim());
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Set a custom label</Dialog.Title>
            </Dialog.Header>
            <Formik initialValues={{ label: label ?? "" }} onSubmit={handleAdd}>
              {({ isValid }) => (
                <Form>
                  <Dialog.Body>
                    <FormikField name="label">
                      {({ field, form, meta }: FieldProps) => (
                        <Field.Root invalid={form.errors.label !== undefined && !!form.touched.label}>
                          <Input {...field} id="label" type="text" color={color} bg={bg} />
                          <Field.ErrorText>
                            <Field.ErrorIcon size="xs" /> {meta.error}
                          </Field.ErrorText>
                          <Field.HelperText>
                            <strong>Note:</strong> this label will override the issuer when the card is displayed.
                          </Field.HelperText>
                        </Field.Root>
                      )}
                    </FormikField>
                  </Dialog.Body>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="ghost">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit" colorPalette="blue" disabled={!isValid}>
                      {label === undefined ? "Add" : "Update"}
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
