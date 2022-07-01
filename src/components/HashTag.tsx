import { Link, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

type HashTagProps = {
  bg?: string;
  label: string;
  onClose?: () => void;
  onClick?: () => void;
};

export default function HashTag({ bg, label, onClick, onClose }: HashTagProps): JSX.Element {
  return (
    <Tag size="sm" px={2} py={1} bg={bg} fontWeight="400">
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
