import {
  Flex,
  HStack,
  IconButton,
  Stack,
  Switch,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import hash from "object-hash";
import * as R from "ramda";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AddTagModal } from "../components/AddTagModal";
import useOtpParameters from "../hooks/useOtpParameters";
import { sort } from "../otp";
import { OTP } from "../types";

export default function Settings(): JSX.Element {
  const [otpParameters, update] = useOtpParameters();
  const [current, setCurrent] = useState<OTP | undefined>(undefined);
  const tagBg = useColorModeValue("gray.50", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddTag = (otp: OTP) => () => {
    onOpen();
    setCurrent(otp);
  };

  const handleConfirmAddTag = (tag: string) => {
    onClose();
    if (current) {
      update({
        ...current,
        tags: R.sortBy(R.toLower, R.uniq([...(current.tags ?? []), tag])),
      });

      setCurrent(undefined);
    }
  };

  const handleDeleteTag = (otp: OTP, tag: string) => () => {
    update({
      ...otp,
      tags: (otp.tags ?? []).filter((t) => t != tag),
    });
  };

  const handleToggleArchived = (otp: OTP) => () => {
    update({
      ...otp,
      archived: !otp.archived,
    });
  };

  return (
    <Flex minH="90vh" align="stretch" justify="center" py={6}>
      <Stack boxShadow="2xl" bg={useColorModeValue("white", "gray.800")} rounded="xl" p={10} spacing={8} align="center">
        <AddTagModal isOpen={isOpen} onAdd={handleConfirmAddTag} onCancel={onClose} />
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Issuer / Name</Th>
              <Th>Tags</Th>
              <Th align="center">Archived</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sort(otpParameters ?? []).map((otp) => (
              <Tr key={hash(otp)}>
                <Td w="200px" valign="top">
                  <VStack align="left">
                    <Text fontWeight={600}>{otp.issuer ?? "Unknown"}</Text>
                    <Text fontWeight={400} color="gray.500" isTruncated>
                      {otp.name}
                    </Text>
                  </VStack>
                </Td>
                <Td w="200px">
                  <HStack alignItems="start">
                    <IconButton
                      aria-label="Add tag"
                      disabled={(otp.tags ?? []).length >= 3}
                      size="sm"
                      onClick={handleAddTag(otp)}
                      icon={<FiPlus />}
                    />
                    <Wrap>
                      {otp.tags?.map((tag) => (
                        <WrapItem key={tag}>
                          <Tag size="sm" px={2} py={1} bg={tagBg} fontWeight="400">
                            <TagLabel>#{tag.toUpperCase()}</TagLabel>
                            <TagCloseButton onClick={handleDeleteTag(otp, tag)} />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </HStack>
                </Td>
                <Td align="center" valign="top">
                  <Switch isChecked={otp.archived} onChange={handleToggleArchived(otp)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Flex>
  );
}
