import { Collapse, Flex, FlexProps, Icon, Link, Tag, Text, useDisclosure, useOutsideClick } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";

interface NavItemProps extends React.PropsWithChildren<FlexProps> {
  label: string;
  icon?: IconType;
  path?: string;
  count?: number;
}

export default function NavItem({ label, icon, path, count, children, ...rest }: NavItemProps): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useOutsideClick({ ref, handler: onClose });

  return (
    <div ref={ref}>
      <Link
        as={RouterLink}
        to={path ?? "#"}
        style={{ textDecoration: "none" }}
        _focus={{ outline: "none" }}
        onClick={path ? undefined : onOpen}
      >
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
          {count !== undefined && (
            <Tag size="sm" variant="solid" colorScheme="teal">
              {count}
            </Tag>
          )}
        </Flex>
      </Link>
      <Collapse in={isOpen} animateOpacity>
        {children}
      </Collapse>
    </div>
  );
}
