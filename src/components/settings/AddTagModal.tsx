import {
  Box,
  Button,
  FormControl,
  FormErrorIcon,
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
import { ErrorMessage, Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as R from "ramda";
import useOtpParameters from "../../hooks/useOtpParameters";
import HashTag from "../HashTag";

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
  if (["NEW!", "UPDATED", "POPULAR"].includes(value.trim().toUpperCase())) {
    return "Cannot use a reserved tag";
  }
  return undefined;
}

export function AddTagModal({ isOpen, onAdd, onCancel }: AddTagModalProps): JSX.Element {
  const color = useColorModeValue("gray.800", "gray.200");
  const bg = useColorModeValue("gray.100", "gray.600");
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
          {({ isValid }) => (
            <Form>
              <ModalBody>
                {tags.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <Text py={2}>Create a new tag:</Text>
                )}
                <Field name="tag" validate={validateTag}>
                  {({ field, form }: FieldProps) => (
                    <FormControl isInvalid={form.errors.tag !== undefined && !!form.touched.tag}>
                      <Input {...field} id="tag" type="text" color={color} bg={bg} />
                      <FormErrorMessage>
                        <FormErrorIcon />
                        <ErrorMessage name="tag" />
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3} disabled={!isValid}>
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
