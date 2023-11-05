import {
  HStack,
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
import { OTP } from "../../types";
import HashTag from "../HashTag";
import AddTagButton from "./AddTagButton";
import CopyEncodedSecretButton from "./CopyEncodedSecretButton";
import CustomLabelButton from "./CustomLabelButton";
import DeleteButton from "./DeleteButton";
import FaviconButton from "./FaviconButton";

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
  );
}
