import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  useControllableState,
  useDisclosure,
} from "@chakra-ui/react";
import { type ChangeEvent, type JSX } from "react";
import { FiSearch } from "react-icons/fi";
import { useKeyPressEvent } from "react-use";
import useFocus from "../hooks/useFocus";
import { useColorModeValue } from "@/components/ui/color-mode";

interface SearchProps {
  onChange?: (value: string) => void;
}

export default function Search({ onChange }: SearchProps): JSX.Element {
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
    setTimeout(setInputFocus, 10);
  };

  useKeyPressEvent("/", handleOpen);
  useKeyPressEvent("Enter", onClose);
  useKeyPressEvent("Escape", handleCancel);

  return (
    <Collapse in={open} animateOpacity>
      <Box p="4px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input ref={inputRef} placeholder="Search" bgColor={bg} value={value} onChange={handleSearch} />
        </InputGroup>
      </Box>
    </Collapse>
  );
}
