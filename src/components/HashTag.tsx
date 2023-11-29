import { Link, Tag, TagCloseButton, TagLabel, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

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
    <Tag size="sm" px={2} py={1} bg={system ? systemBg : bg} fontWeight="400">
      <TagLabel>
        {onClick ? (
          <Link onClick={onClick}>#{label.toUpperCase()}</Link>
        ) : (
          <Link as={RouterLink} to={`/tags/${label}`}>
            #{label.toUpperCase()}
          </Link>
        )}
      </TagLabel>
      {onClose && <TagCloseButton onClick={onClose} />}
    </Tag>
  );
}
