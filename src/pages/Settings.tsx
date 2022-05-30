import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
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
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import hash from "object-hash";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTagButton from "../components/AddTagButton";
import CustomLabelButton from "../components/CustomLabelButton";
import DeleteButton from "../components/DeleteButton";
import HashTag from "../components/HashTag";
import { getFavicon } from "../favicons";
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
  const toast = useToast();

  const enableNotifications = useCallback(async () => {
    if (settings?.enableNotifications && Notification.permission !== "granted") {
      const reason = await Notification.requestPermission();
      if (reason !== "granted") {
        toast({
          title: "Requested permission for notications was not granted",
          description: `In order to use this functionality you must allow the browser to post notifications.`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        updateSettings({ ...settings, enableNotifications: false });
      }
    }
  }, [toast, settings, updateSettings]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    enableNotifications().catch(console.error);
  }, [enableNotifications]);

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

  const handleToggleEnableNotifications = () => {
    updateSettings({ ...settings, enableNotifications: !settings?.enableNotifications });
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

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="show-qr-codes" mb="0">
            Enable Notifications (WIP)?
          </FormLabel>
          <Switch
            id="enable-notifications"
            isChecked={settings?.enableNotifications}
            onChange={handleToggleEnableNotifications}
          />
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
                  <HStack alignItems="flex-start">
                    <Image src={getFavicon(otp)} h={5} />
                    <VStack align="left">
                      <Text fontWeight={600}>
                        {otp.issuer ?? "Unknown"} {otp.label && `(${otp.label})`}
                      </Text>
                      <Text fontWeight={400} color="gray.500" noOfLines={1}>
                        {otp.name}
                      </Text>
                    </VStack>
                  </HStack>
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
