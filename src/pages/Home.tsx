import Group from "../components/Group";
import Redirect from "../components/Redirect";

export function Home() {
  return <Group noData={<Redirect to="/import" />} />;
}
