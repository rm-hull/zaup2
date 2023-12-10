import { Button } from "@chakra-ui/react";
import { type JSX } from "react";
import { uploadFile } from "../../api/googleDrive";
// import { ipAddress } from "../../api/ipify";
import useAccessToken from "../../hooks/useAccessToken";
import useGeneralSettings from "../../hooks/useGeneralSettings";
import useOtpParameters from "../../hooks/useOtpParameters";

export default function TestUpload(): JSX.Element {
  const [settings] = useGeneralSettings();
  const { data } = useOtpParameters();
  const [accessToken] = useAccessToken();

  const handleUpload = async (): Promise<void> => {
    if (accessToken?.access_token !== undefined) {
      const payload = {
        otp: data ?? [],
        settings: settings ?? {},
        lastSync: {
          on: new Date().toUTCString(),
          from: "TBC", //await ipAddress(),
          url: window.location.href,
        },
      };

      await uploadFile(
        accessToken?.access_token,
        "zaup2_sync.json",
        "application/json",
        JSON.stringify(payload, null, 2)
      );
    }
  };

  return <Button onClick={handleUpload}>Upload file to Google Drive</Button>;
}
