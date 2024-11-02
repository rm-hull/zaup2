import {
  Collapsible,
  Flex,
  Icon,
  Link,
  Spacer,
  Text,
  useDisclosure,
  useOutsideClick,
  type FlexProps,
} from "@chakra-ui/react";
import { useRef, type JSX, type PropsWithChildren } from "react";
import { type IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import { Tag } from "@/components/ui/tag";

interface NavItemProps extends PropsWithChildren<FlexProps> {
  label: string;
  icon?: IconType;
  path?: string;
  count?: number;
  color?: string;
}

export default function NavItem({ label, icon, path, count, children, color, ...rest }: NavItemProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { open, onOpen, onClose } = useDisclosure();

  useOutsideClick({ ref, handler: onClose });

  return (
    <div ref={ref}>
      <Link
        as={RouterLink}
        href={path ?? "#"}
        style={{ textDecoration: "none" }}
        _focus={{ outline: "none" }}
        onClick={path === undefined ? onOpen : undefined}
        color={color}
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
          {icon !== undefined && <Icon mr={3} fontSize="16" _groupHover={{ color: "white" }} as={icon} />}
          <Text lineClamp={1}>{label}</Text>
          <Spacer />
          {count !== undefined && (
            <Tag size="sm" variant="solid" colorScheme="blue">
              {count}
            </Tag>
          )}
        </Flex>
      </Link>
      <Collapsible.Root open={open}>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
