import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectProps {
  to: string;
}

export default function Redirect({ to }: RedirectProps) {
  const navigate = useNavigate();
  useEffect(() => void navigate(to), [navigate, to]);
  return null;
}
