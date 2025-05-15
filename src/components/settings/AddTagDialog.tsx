import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  Field,
  Text,
} from "@chakra-ui/react";
import { Field as FormikField, Form, Formik, type FieldProps, type FormikHelpers } from "formik";
import * as R from "ramda";
import { type JSX } from "react";
import useOtpParameters from "../../hooks/useOtpParameters";
import HashTag from "../HashTag";
import { useColorModeValue } from "@/components/ui/color-mode";

interface AddTagDialogProps {
  open: boolean;
  onAdd: (tag: string) => void;
  onCancel: () => void;
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

export function AddTagDialog({ open, onAdd, onCancel }: AddTagDialogProps): JSX.Element {
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
    <DialogRoot open={open} onOpenChange={onCancel}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Add tag</DialogHeader>
        <Formik initialValues={{ tag: "" }} onSubmit={handleAdd}>
          {({ isValid }) => (
            <Form>
              <DialogBody>
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
                  {({ field, meta }: FieldProps) => (
                    <Field.Root>
                      <Input {...field} id="tag" type="text" color={color} bg={bg} />
                      <Field.ErrorText>{meta.error}</Field.ErrorText>
                    </Field.Root>
                  )}
                </FormikField>
              </DialogBody>

              <DialogFooter>
                <Button type="submit" colorPalette="blue" mr={3} disabled={!isValid}>
                  Add
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
