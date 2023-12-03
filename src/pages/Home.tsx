import Group from "../components/Group";
import useOtpParameters from "../hooks/useOtpParameters";
import Redirect from "../components/Redirect";

export default function Home(): JSX.Element | null {
  const { data } = useOtpParameters();

  if (data === undefined) {
    return null;
  } else if (data?.length === 0) {
    return <Redirect to="/import" />;
  }

  return <Group />;
}
