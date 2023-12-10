import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, type JSX } from "react";
import useAccessToken from "../hooks/useAccessToken";
import useGeneralSettings from "../hooks/useGeneralSettings";

export default function AutoLogin(): JSX.Element {
  const [settings] = useGeneralSettings();
  const [accessToken, setAccessToken] = useAccessToken();

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "https://www.googleapis.com/auth/drive.file",
    onSuccess: setAccessToken,
  });

  useEffect(() => {
    if ((settings?.syncToGoogleDrive ?? false) && accessToken === undefined) {
      googleLogin();
    }
  }, [settings, accessToken, googleLogin]);

  return <></>;
}
