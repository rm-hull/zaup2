import { Box, Collapsible, Input, InputGroup, useControllableState, useDisclosure } from "@chakra-ui/react";
import { type ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { useKeyPressEvent } from "react-use";
import useFocus from "../hooks/useFocus";
import { useColorModeValue } from "@/components/ui/color-mode";

interface SearchProps {
  onChange?: (value: string) => void;
}

export default function Search({ onChange }: SearchProps) {
  const { open, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "", onChange });
  const [inputRef, setInputFocus] = useFocus();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleCancel = (e: { preventDefault: () => void }): void => {
    if (open) {
      e.preventDefault();
      setValue("");
      onClose();
    }
  };

  const handleOpen = (): void => {
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
          <InputGroup startElement={<FiSearch />} startElementProps={{ pointerEvents: "none" }}>
            <Input id="search" ref={inputRef} placeholder="Search" bgColor={bg} value={value} onChange={handleSearch} />
          </InputGroup>
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
