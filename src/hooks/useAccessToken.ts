import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

interface UseAccessTokenReturnType {
  accessToken?: string;
  login: () => void;
  error?: Error;
}
type TokenInfo = Omit<TokenResponse, "error" | "error_description" | "error_uri">;

export default function useAccessToken(scope: string): UseAccessTokenReturnType {
  const [accessToken, setAccessToken] = useState<TokenInfo>();
  const [error, setError] = useState<Error>();

  const googleLogin = useGoogleLogin({ flow: "implicit", scope, onSuccess: setAccessToken, onError: setError });

  return {
    accessToken: accessToken?.access_token,
    error,
    login: googleLogin,
  };
}
