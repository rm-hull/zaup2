import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Radio,
  RadioGroup,
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
import { useNavigate } from "react-router-dom";
import AddTagButton from "../components/AddTagButton";
import CopyEncodedSecretButton from "../components/CopyEncodedSecretButton";
import CustomLabelButton from "../components/CustomLabelButton";
import DeleteButton from "../components/DeleteButton";
import FaviconButton from "../components/FaviconButton";
import HashTag from "../components/HashTag";
import { getFavicon } from "../favicons";
import useGeneralSettings from "../hooks/useGeneralSettings";
import useOtpParameters from "../hooks/useOtpParameters";
import { sortBy } from "../otp";
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

  const handleToggleShowCounts = () => {
    updateSettings({ ...settings, showCounts: !settings?.showCounts });
  };

  const handleUpdateSortOrder = (sortOrder: keyof typeof sortBy) => {
    updateSettings({ ...settings, sortOrder });
  };

  return (
    <Flex minH="90vh" justify="center" py={6} direction="column" align="center">
      <Stack boxShadow="2xl" bg={stackBg} rounded="xl" p={10} spacing={8} mb={8} align="center" minWidth={1024}>
        <Heading size="md">General Settings</Heading>

        <FormControl display="flex" alignItems="center">
          <Switch id="show-qr-codes" isChecked={settings?.showQRCode} onChange={handleToggleShowQRCode} />
          <FormLabel htmlFor="show-qr-codes" mb={0} ml={2}>
            Show QR codes
          </FormLabel>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <Switch id="show-counts" isChecked={settings?.showCounts} onChange={handleToggleShowCounts} />
          <FormLabel htmlFor="show-counts" mb={0} ml={2}>
            Show counts in menu
          </FormLabel>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="sort-order" mb={0}>
            Sort by:
          </FormLabel>
          <RadioGroup id="sort-order" onChange={handleUpdateSortOrder} value={settings?.sortOrder}>
            <Stack direction="row">
              <Radio value="name">name</Radio>
              <Radio value="lastUsed">last used</Radio>
              <Radio value="mostUsed">most used</Radio>
            </Stack>
          </RadioGroup>
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
            {sortBy.name(data).map((otp) => (
              <Tr key={hash(otp)}>
                <Td valign="top">
                  <HStack alignItems="flex-start">
                    <Image src={getFavicon(otp)} h={5} />
                    <VStack align="left">
                      <Text fontWeight={600}>
                        {otp.label || otp.issuer || "«Unknown»"} {otp.label && otp.issuer && `(${otp.issuer})`}
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
                <Td align="center" w={50}>
                  <Switch isChecked={otp.archived} onChange={handleToggleArchived(otp)} />
                </Td>
                <Td align="center">
                  <HStack>
                    <DeleteButton otp={otp} onDeleteRequested={remove} />
                    <CustomLabelButton otp={otp} onUpdateRequested={update} />
                    <FaviconButton otp={otp} onUpdateRequested={update} />
                    <CopyEncodedSecretButton otp={otp} />
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
