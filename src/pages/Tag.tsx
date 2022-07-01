import { useParams } from "react-router-dom";
import Group from "../components/Group";

export default function Tag(): JSX.Element {
  const { tag } = useParams();
  return <Group filter={(otp) => (otp.tags ?? []).includes(tag ?? "unknown")} />;
}
