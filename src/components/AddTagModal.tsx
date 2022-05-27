import {
  Box,
  Button,
  FormControl,
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
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as R from "ramda";
import React from "react";
import useOtpParameters from "../hooks/useOtpParameters";
import HashTag from "./HashTag";

type AddTagModalProps = {
  isOpen: boolean;
  onAdd: (tag: string) => void;
  onCancel: () => void;
};
type AddTagForm = {
  tag: string;
};

function validateTag(value: string) {
  if (value.trim().length === 0) {
    return "Value is required";
  }
  return undefined;
}

export function AddTagModal({ isOpen, onAdd, onCancel }: AddTagModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
  const focusBg = useColorModeValue("gray.200", "gray.800");
  const tagBg = useColorModeValue("gray.50", "gray.800");

  const { data } = useOtpParameters();
  const tags = R.sortBy(R.toLower, R.uniq(data.flatMap((otp) => otp.tags ?? [])));

  const handleAdd = (values: AddTagForm, actions: FormikHelpers<AddTagForm>) => {
    try {
      onAdd(values.tag);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add tag</ModalHeader>
        <Formik initialValues={{ tag: "" }} onSubmit={handleAdd}>
          {() => (
            <Form>
              <ModalBody>
                {tags.length > 0 ? (
                  <React.Fragment>
                    <Text py={2}>Pick an existing tag:</Text>
                    <Box bg={bg} borderRadius={10} p={2}>
                      <Wrap>
                        {tags.map((tag) => (
                          <WrapItem key={tag}>
                            <HashTag label={tag} bg={tagBg} onClick={() => onAdd(tag)} />
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                    <Text py={2}>Or create a new one:</Text>
                  </React.Fragment>
                ) : (
                  <Text py={2}>Create a new tag:</Text>
                )}
                <Field name="tag" validate={validateTag}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.tag !== undefined && !!form.touched.tag}>
                      <Input
                        {...field}
                        id="tag"
                        type="text"
                        color={color}
                        bg={bg}
                        border={0}
                        _focus={{
                          bg: focusBg,
                          outline: "none",
                        }}
                      />
                      <FormErrorMessage>{form.errors.tag}</FormErrorMessage>
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
                  Add
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
