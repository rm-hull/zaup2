import { Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useColorModeValue } from "./ui/color-mode";
import { Tag } from "./ui/tag";

interface HashTagProps {
  bg?: string;
  label: string;
  onClose?: () => void;
  onClick?: () => void;
  system?: boolean;
}

export default function HashTag({ bg, label, onClick, onClose, system = false }: HashTagProps) {
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
