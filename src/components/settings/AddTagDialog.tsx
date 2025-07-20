import { Box, Button, Flex, HStack, Input, Dialog, Field, Text, Portal, CloseButton } from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import * as R from "ramda";
import { PropsWithChildren } from "react";
import useOtpParameters from "../../hooks/useOtpParameters";
import HashTag from "../HashTag";
import { useColorModeValue } from "@/components/ui/color-mode";

interface AddTagDialogProps {
  onAdd: (tag: string) => void;
}

interface AddTagForm {
  tag: string;
}

function validateTag(value: string): string | undefined {
  if (value.trim().length === 0) {
    return "Value is required";
  }
  if (["NEW!", "UPDATED", "POPULAR"].includes(value.trim().toUpperCase())) {
    return "Cannot use a reserved tag";
  }
  return undefined;
}

export function AddTagDialog({ children, onAdd }: PropsWithChildren<AddTagDialogProps>) {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const tagBg = useColorModeValue("gray.50", "gray.800");

  const { data = [] } = useOtpParameters();
  const tags = R.sortBy(R.toLower, R.uniq(data.flatMap((otp) => otp.tags ?? [])));

  const handleAdd = (values: AddTagForm, actions: FormikHelpers<AddTagForm>): void => {
    try {
      onAdd(values.tag);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog.Root placement="top">
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add tag</Dialog.Title>
            </Dialog.Header>
            <Formik initialValues={{ tag: "" }} onSubmit={handleAdd}>
              {({ isValid }) => (
                <Form>
                  <Dialog.Body>
                    {tags.length > 0 ? (
                      <>
                        <Text py={2}>Pick an existing tag:</Text>
                        <Box bg={bg} borderRadius={10} p={2}>
                          <HStack wrap="wrap">
                            {tags.map((tag) => (
                              <Flex key={tag} align="flex-start">
                                <HashTag
                                  label={tag}
                                  bg={tagBg}
                                  onClick={() => {
                                    onAdd(tag);
                                  }}
                                />
                              </Flex>
                            ))}
                          </HStack>
                        </Box>
                        <Text py={2}>Or create a new one:</Text>
                      </>
                    ) : (
                      <Text py={2}>Create a new tag:</Text>
                    )}
                    <FormikField name="tag" validate={validateTag}>
                      {({ field, form, meta }: FieldProps) => (
                        <Field.Root invalid={form.errors.tag !== undefined && !!form.touched.tag}>
                          <Input {...field} id="tag" type="text" color={color} bg={bg} />
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
                      Add
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
