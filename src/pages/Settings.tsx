import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Switch,
  Table,
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
import CustomLabelButton from "../components/CustomLabelButton";
import DeleteButton from "../components/DeleteButton";
import HashTag from "../components/HashTag";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { sort } from "../otp";
import { OTP } from "../types";

export default function Settings(): JSX.Element | null {
  const { data, update, remove } = useOtpParameters({ includeArchived: true });
  const [settings, updateSettings] = useGeneralSettings();

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

  const handleToggleShowQRCode = () => {
    updateSettings({ ...settings, showQRCode: !settings?.showQRCode });
  };

  return (
    <Flex minH="90vh" justify="center" py={6} direction="column" align="center">
      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} mb={8} align="center" minWidth={1024}>
        <Heading size="md">General Settings</Heading>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="show-qr-codes" mb="0">
            Show QR codes?
          </FormLabel>
          <Switch id="show-qr-codes" isChecked={settings?.showQRCode} onChange={handleToggleShowQRCode} />
        </FormControl>
      </Stack>

      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} align="center" minWidth={1024}>
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
                    <Text fontWeight={600}>
                      {otp.issuer ?? "Unknown"} {otp.label && `(${otp.label})`}
                    </Text>
                    <Text fontWeight={400} color="gray.500" noOfLines={1}>
                      {otp.name}
                    </Text>
                  </VStack>
                </Td>
                <Td w="200px">
                  <HStack alignItems="start">
                    <AddTagButton otp={otp} onAddRequested={update} />
                    <Wrap>
                      {otp.tags?.map((tag) => (
                        <WrapItem key={tag}>
                          <HashTag label={tag} bg={tagBg} onClose={handleDeleteTag(otp, tag)} />
                        </WrapItem>
                      ))}
                    </Wrap>
                  </HStack>
                </Td>
                <Td align="center">
                  <Switch isChecked={otp.archived} onChange={handleToggleArchived(otp)} />
                </Td>
                <Td align="center">
                  <HStack>
                    <DeleteButton otp={otp} onDeleteRequested={remove} />
                    <CustomLabelButton otp={otp} onUpdateRequested={update} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Flex>
  );
}
