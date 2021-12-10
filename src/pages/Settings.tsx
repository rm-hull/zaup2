import {
  Flex,
  HStack,
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
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import hash from "object-hash";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddTagButton from "../components/AddTagButton";
import DeleteButton from "../components/DeleteButton";
import useOtpParameters from "../hooks/useOtpParameters";
import { sort } from "../otp";
import { OTP } from "../types";

export default function Settings(): JSX.Element | null {
  const { data, update } = useOtpParameters();
  const tagBg = useColorModeValue("gray.50", "gray.800");
  const stackBg = useColorModeValue("white", "gray.800");
  const navigate = useNavigate();
  if (data.length === 0) {
    navigate("/import");
    return null;
  }

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
      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} align="center">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Issuer / Name</Th>
              <Th>Tags</Th>
              <Th align="center">Archived</Th>
              <Th align="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sort(data).map((otp) => (
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
                    <AddTagButton otp={otp} />
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
                <Td align="center">
                  <Switch isChecked={otp.archived} onChange={handleToggleArchived(otp)} />
                </Td>
                <Td align="center">
                  <DeleteButton otp={otp} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Flex>
  );
}
