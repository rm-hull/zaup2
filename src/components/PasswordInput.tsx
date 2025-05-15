import { Button, Input, InputGroup, type InputProps } from "@chakra-ui/react";
import { useState, type JSX } from "react";

export default function PasswordInput(inputProps: InputProps): JSX.Element {
  const [show, setShow] = useState(false);
  const handleClick = (): void => {
    setShow((prev) => !prev);
  };

  return (
    <InputGroup
      // size="md"
      endElement={
        <Button h="1.75rem" size="sm" onClick={handleClick} tabIndex={-1}>
          {show ? "Hide" : "Show"}
        </Button>
      }
    >
      <Input {...inputProps} pr="4.5rem" type={show ? "text" : "password"} />
    </InputGroup>
  );
}
