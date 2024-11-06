import {
  Button,
  Input,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import { type JSX } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

interface CustomLabelDialogProps {
  label?: string;
  open: boolean;
  onUpdate: (label?: string) => void;
  onCancel: () => void;
}
interface CustomLabelForm {
  label: string;
}

export function CustomLabelDialog({ label, open, onUpdate, onCancel }: CustomLabelDialogProps): JSX.Element {
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
    <DialogRoot open={open} onOpenChange={onCancel}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Set a custom label</DialogHeader>
        <Formik initialValues={{ label: label ?? "" }} onSubmit={handleAdd}>
          {({ isValid }) => (
            <Form>
              <DialogBody>
                <Field name="label">
                  {({ field, form, meta }: FieldProps) => (
                    <Field isInvalid={form.errors.label !== undefined && !!form.touched.label} errorText={meta.error}>
                      <Input {...field} id="label" type="text" color={color} bg={bg} />
                    </Field>
                  )}
                </Field>
                <Text textStyle="xs" color="gray.500">
                  <strong>Note:</strong> this label will override the issuer when the card is displayed.
                </Text>
              </DialogBody>

              <DialogFooter>
                <Button type="submit" colorScheme="blue" mr={3} disabled={!isValid}>
                  {label === undefined ? "Add" : "Update"}
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
