import { Box, Collapsible, Flex, type FlexProps, Icon, Link, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";
import { type IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";
import { Tag } from "./ui/tag";

interface NavItemProps extends PropsWithChildren<FlexProps> {
  label: string;
  icon?: IconType;
  path?: string;
  count?: number;
  color?: string;
}

export default function NavItem({ label, icon, path, count, children, color, ...rest }: NavItemProps) {
  const { open, onToggle } = useDisclosure();

  return (
    <Box>
      <Link
        asChild
        style={{ textDecoration: "none" }}
        _focus={{ outline: "none" }}
        onClick={path === undefined ? onToggle : undefined}
        color={color}
      >
        <RouterLink to={path ?? "#"}>
          <Flex
            width={children ? 220 : undefined}
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
              <Tag size="sm" variant="solid" colorPalette="blue">
                {count}
              </Tag>
            )}
          </Flex>
        </RouterLink>
      </Link>
      <Collapsible.Root open={open}>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
