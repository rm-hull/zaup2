import { Button, Input, InputGroup, type InputProps } from "@chakra-ui/react";
import { useState } from "react";

export default function PasswordInput(inputProps: InputProps) {
  const [show, setShow] = useState(false);
  const handleClick = (): void => {
    setShow((prev) => !prev);
  };

  return (
    <InputGroup
      endElement={
        <Button h="1.5rem" size="xs" onClick={handleClick} tabIndex={-1} variant="subtle" colorPalette="blue">
          {show ? "hide" : "show"}
        </Button>
      }
    >
      <Input {...inputProps} pr="4.5rem" type={show ? "text" : "password"} />
    </InputGroup>
  );
}
