import { Button, Input, InputGroup, type InputProps, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

export default function PasswordInput(inputProps: InputProps): JSX.Element {
  const [show, setShow] = useState(false);
  const handleClick = (): void => {
    setShow((prev) => !prev);
  };

  return (
    <InputGroup size="md">
      <Input {...inputProps} pr="4.5rem" type={show ? "text" : "password"} />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
