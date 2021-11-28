import React from "react";
import { useNavigate } from "react-router-dom";
import Group from "../components/Group";
import useOtpParameters from "../hooks/useOtpParameters";

export default function Home(): JSX.Element | null {
  const [otpParameters] = useOtpParameters();
  const navigate = useNavigate();
  if (otpParameters.length === 0) {
    navigate("/import");
    return null;
  }
  return <Group />;
}
