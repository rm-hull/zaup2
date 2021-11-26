import { Collapse, Flex, FlexProps, Icon, Link, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";

interface NavItemProps extends React.PropsWithChildren<FlexProps> {
  label: string;
  icon?: IconType;
  path?: string;
}
export default function NavItem({ label, icon, path, children, ...rest }: NavItemProps): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <React.Fragment>
      <Link as={RouterLink} to={path ?? "#"} style={{ textDecoration: "none" }} onClick={path ? undefined : onToggle}>
        <Flex
          align="center"
          p={3}
          mx={3}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{ bg: "cyan.400", color: "white" }}
          {...rest}
        >
          {icon && <Icon mr={3} fontSize="16" _groupHover={{ color: "white" }} as={icon} />}
          <Text isTruncated>{label}</Text>
        </Flex>
      </Link>
      <Collapse in={isOpen} animateOpacity>
        {children}
      </Collapse>
    </React.Fragment>
  );
}
