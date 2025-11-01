import { Flex, HStack, Heading, Image, Table, Text, VStack } from "@chakra-ui/react";
import hash from "object-hash";
import { getCachedFavicon } from "../../favicons";
import useOtpParameters from "../../hooks/useOtpParameters";
import { sortBy } from "../../otp";
import { type OTP } from "../../types";
import HashTag from "../HashTag";
import SystemTags from "../SystemTags";
import { useColorModeValue } from "../ui/color-mode";
import { Switch } from "../ui/switch";
import AddTagButton from "./AddTagButton";
import CopyEncodedSecretButton from "./CopyEncodedSecretButton";
import CustomLabelButton from "./CustomLabelButton";
import DeleteButton from "./DeleteButton";
import FaviconButton from "./FaviconButton";

export default function OTPSettings() {
  const { data, update, remove } = useOtpParameters({ includeArchived: true });
  const tagBg = useColorModeValue("gray.50", "gray.800");

  if (data?.length === 0) {
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

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Issuer / Name</Table.ColumnHeader>
            <Table.ColumnHeader p={2}>Tags</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" p={2}>
              Copy Count
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" p={2}>
              Archived
            </Table.ColumnHeader>
            <Table.ColumnHeader p={2}>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortBy.name(data).map((otp: OTP) => (
            <Table.Row key={hash(otp)}>
              <Table.Cell valign="top">
                <HStack alignItems="flex-start">
                  <Image src={getCachedFavicon(otp)} h={5} filter={otp.archived ? "grayscale(100%)" : "none"} />
                  <VStack align="left">
                    <Text fontWeight={600} textDecoration={otp.archived ? "line-through" : undefined}>
                      {otp.label ?? otp.issuer ?? "«Unknown»"} {otp.label && otp.issuer && `(${otp.issuer})`}
                    </Text>
                    <Text fontWeight={400} color="gray.500" lineClamp={1} maxWidth="dw">
                      {otp.name}
                    </Text>
                  </VStack>
                </HStack>
              </Table.Cell>
              <Table.Cell p={2}>
                <HStack alignItems="start">
                  <AddTagButton otp={otp} onAddRequested={update} />
                  <HStack wrap="wrap">
                    {otp.tags?.map((tag) => (
                      <Flex key={tag} align="flex-start">
                        <HashTag label={tag} bg={tagBg} onClose={handleDeleteTag(otp, tag)} />
                      </Flex>
                    ))}
                    <SystemTags otp={otp} />
                  </HStack>
                </HStack>
              </Table.Cell>
              <Table.Cell textAlign="center" p={2}>
                {otp.copyCount ?? 0}
              </Table.Cell>
              <Table.Cell textAlign="center" p={2}>
                <Switch checked={otp.archived} onChange={handleToggleArchived(otp)} colorPalette="blue" />
              </Table.Cell>
              <Table.Cell p={2}>
                <HStack>
                  <DeleteButton otp={otp} onDeleteRequested={remove} />
                  <CustomLabelButton otp={otp} onUpdateRequested={update} />
                  <FaviconButton otp={otp} onUpdateRequested={update} />
                  <CopyEncodedSecretButton otp={otp} />
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
