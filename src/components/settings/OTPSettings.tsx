import {
  HStack,
  Heading,
  Image,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import hash from "object-hash";
import { useNavigate } from "react-router-dom";
import { getFavicon } from "../../favicons";
import useOtpParameters from "../../hooks/useOtpParameters";
import { sortBy } from "../../otp";
import { type OTP } from "../../types";
import HashTag from "../HashTag";
import AddTagButton from "./AddTagButton";
import CopyEncodedSecretButton from "./CopyEncodedSecretButton";
import CustomLabelButton from "./CustomLabelButton";
import DeleteButton from "./DeleteButton";
import FaviconButton from "./FaviconButton";
import SystemTags from "../SystemTags";

export default function OTPSettings(): JSX.Element | null {
  const { data, update, remove } = useOtpParameters({ includeArchived: true });

  const tagBg = useColorModeValue("gray.50", "gray.800");
  const navigate = useNavigate();

  if (data.length === 0) {
    navigate("/import");
    return null;
  }

  const handleDeleteTag = (otp: OTP, tag: string) => () => {
    update({
      ...otp,
      tags: (otp.tags ?? []).filter((t) => t !== tag),
    });
  };

  const handleToggleArchived = (otp: OTP) => () => {
    update({
      ...otp,
      archived: !(otp.archived ?? false),
    });
  };

  return (
    <>
      <Heading size="md">OTP Settings</Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Issuer / Name</Th>
            <Th p={2}>Tags</Th>
            <Th textAlign="center" p={2}>
              Copy Count
            </Th>
            <Th textAlign="center" p={2}>
              Archived
            </Th>
            <Th p={2}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortBy.name(data).map((otp: OTP) => (
            <Tr key={hash(otp)}>
              <Td valign="top">
                <HStack alignItems="flex-start">
                  <Image src={getFavicon(otp)} h={5} />
                  <VStack align="left">
                    <Text fontWeight={600}>
                      {otp.label ?? otp.issuer ?? "«Unknown»"} {otp.label && otp.issuer && `(${otp.issuer})`}
                    </Text>
                    <Text fontWeight={400} color="gray.500" noOfLines={1} maxWidth="dw">
                      {otp.name}
                    </Text>
                  </VStack>
                </HStack>
              </Td>
              <Td p={2}>
                <HStack alignItems="start">
                  <AddTagButton otp={otp} onAddRequested={update} />
                  <Wrap>
                    {otp.tags?.map((tag) => (
                      <WrapItem key={tag}>
                        <HashTag label={tag} bg={tagBg} onClose={handleDeleteTag(otp, tag)} />
                      </WrapItem>
                    ))}
                    <SystemTags otp={otp} />
                  </Wrap>
                </HStack>
              </Td>
              <Td textAlign="center" p={2}>
                {otp.copyCount ?? 0}
              </Td>
              <Td textAlign="center" p={2}>
                <Switch isChecked={otp.archived} onChange={handleToggleArchived(otp)} />
              </Td>
              <Td p={2}>
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
    </>
  );
}
