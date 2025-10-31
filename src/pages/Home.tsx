import Group from "../components/Group";
import Redirect from "../components/Redirect";
import useOtpParameters from "../hooks/useOtpParameters";

export function Home() {
  const { data, error, isLoading } = useOtpParameters();

  console.log({ error, isLoading });
  if (data === undefined) {
    return null;
  } else if (data?.length === 0) {
    return <Redirect to="/import" />;
  }

  return <Group />;
}
