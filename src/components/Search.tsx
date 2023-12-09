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
import { useEffect, type ChangeEvent, type JSX } from "react";
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
    e.preventDefault();
    setValue("");
    onClose();
  };

  const handleBlur = (): void => {
    setTimeout(onClose, 300);
  };

  useKeyPressEvent("/", onOpen);
  useKeyPressEvent("Enter", onClose);
  useKeyPressEvent("Escape", handleCancel);

  useEffect(() => {
    if (isOpen) {
      setInputFocus();
    }
  }, [isOpen, setInputFocus]);

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box p="4px">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch />
          </InputLeftElement>
          <Input
            ref={inputRef}
            placeholder="Search"
            bgColor={bg}
            value={value}
            onChange={handleSearch}
            onBlur={handleBlur}
          />
        </InputGroup>
      </Box>
    </Collapse>
  );
}
