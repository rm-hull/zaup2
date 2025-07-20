import { useEffect, useState } from "react";

import { GoogleDrive } from "../api/googleDrive";

import useAccessToken from "./useAccessToken";

export interface UseGoogleDriveReturnType {
  drive?: GoogleDrive;
  login: () => void;
  error: unknown;
}

export default function useGoogleDrive(filename: string): UseGoogleDriveReturnType {
  const [drive, setDrive] = useState<GoogleDrive>();
  const { accessToken, login, error } = useAccessToken("https://www.googleapis.com/auth/drive.file");

  useEffect(() => {
    if (accessToken !== undefined) {
      setDrive(new GoogleDrive(accessToken, filename));
    }
  }, [setDrive, accessToken, filename]);

  return { drive, login, error };
}
