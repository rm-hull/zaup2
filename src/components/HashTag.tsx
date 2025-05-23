import { Link } from "@chakra-ui/react";
import { type JSX } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Tag } from "@/components/ui/tag";
import { useColorModeValue } from "@/components/ui/color-mode";

interface HashTagProps {
  bg?: string;
  label: string;
  onClose?: () => void;
  onClick?: () => void;
  system?: boolean;
}

export default function HashTag({ bg, label, onClick, onClose, system = false }: HashTagProps): JSX.Element {
  const systemBg = useColorModeValue("purple.50", "purple.900");
  return (
    <Tag
      size="sm"
      px={2}
      py={1}
      bg={system ? systemBg : bg}
      fontWeight="400"
      closable={onClose !== undefined}
      onClose={onClose}
    >
      <>
        {onClick !== undefined ? (
          <Link onClick={onClick}>#{label.toUpperCase()}</Link>
        ) : (
          <Link as={RouterLink} href={`/tags/${label}`}>
            #{label.toUpperCase()}
          </Link>
        )}
      </>
    </Tag>
  );
}
