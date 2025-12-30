import {
  Box,
  CloseButton,
  Collapsible,
  Input,
  InputGroup,
  useControllableState,
  useDisclosure,
} from "@chakra-ui/react";
import { type ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { useKeyPressEvent } from "react-use";
import useFocus from "../hooks/useFocus";
import { useColorModeValue } from "./ui/color-mode";

interface SearchProps {
  onChange?: (value: string) => void;
}

export default function Search({ onChange }: SearchProps) {
  const { open, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "", onChange });
  const [inputRef, setInputFocus] = useFocus();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClearSearch = () => {
    setValue("");
  };

  const handleCancel = (e: { preventDefault: () => void }) => {
    if (open) {
      e.preventDefault();
      setValue("");
      onClose();
    }
  };

  const handleOpen = () => {
    onOpen();
    setTimeout(setInputFocus, 25);
  };

  useKeyPressEvent("/", handleOpen);
  useKeyPressEvent("Enter", onClose);
  useKeyPressEvent("Escape", handleCancel);

  return (
    <Collapsible.Root open={open}>
      <Collapsible.Content>
        <Box p="4px">
          <InputGroup
            startElement={<FiSearch />}
            startElementProps={{ pointerEvents: "none" }}
            endElement={<CloseButton size="xs" disabled={!value} onClick={handleClearSearch} />}
          >
            <Input id="search" ref={inputRef} placeholder="Search" bgColor={bg} value={value} onChange={handleSearch} />
          </InputGroup>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
