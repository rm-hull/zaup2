import { TokenResponse } from "@react-oauth/google";
import { atom, useAtom } from "jotai";

type TokenInfo = Omit<TokenResponse, "error" | "error_description" | "error_uri">;
const accessToken = atom<TokenInfo | undefined>(undefined);

type UseAccessTokenReturnType = [TokenInfo | undefined, (accessToken: TokenInfo | undefined) => void];

export default function useAccessToken(): UseAccessTokenReturnType {
  return useAtom(accessToken);
}
