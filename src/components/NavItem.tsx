import { Flex, FlexProps, Icon, Link } from "@chakra-ui/react";
import React, { ReactText } from "react";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: ReactText;
}
export default function NavItem({ icon, path, children, ...rest }: NavItemProps): JSX.Element {
  return (
    <Link as={RouterLink} to={path} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{ bg: "cyan.400", color: "white" }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" _groupHover={{ color: "white" }} as={icon} />}
        {children}
      </Flex>
    </Link>
  );
}
