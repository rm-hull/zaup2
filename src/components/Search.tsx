import {
  Box,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useControllableState,
  useDisclosure,
} from "@chakra-ui/react";
import { type ChangeEvent, type JSX } from "react";
import { FiSearch } from "react-icons/fi";
import { useKeyPressEvent } from "react-use";
import useFocus from "../hooks/useFocus";

interface SearchProps {
  onChange?: (value: string) => void;
}

export default function Search({ onChange }: SearchProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [value, setValue] = useControllableState({ defaultValue: "", onChange });
  const [inputRef, setInputFocus] = useFocus();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleCancel = (e: { preventDefault: () => void }): void => {
    if (isOpen) {
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
    <Collapse in={isOpen} animateOpacity>
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
