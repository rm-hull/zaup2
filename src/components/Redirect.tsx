import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectProps {
  to: string;
}

export default function Redirect({ to }: RedirectProps): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return <></>;
}
