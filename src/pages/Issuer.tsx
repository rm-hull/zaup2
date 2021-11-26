import React from "react";
import { useParams } from "react-router-dom";
import Group from "../components/Group";

export default function Issuer(): JSX.Element {
  const { issuer } = useParams();
  return <Group filter={(otp) => (otp.issuer ?? "Unknown").toLowerCase() === issuer?.toLowerCase()} />;
}
