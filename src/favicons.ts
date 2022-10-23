import favicons from "./assets/favicons.json";
import { OTP } from "./types";

export const getFavicon = (otp: OTP): string | undefined => {
  if (otp.favicon) {
    return otp.favicon;
  }

  const name = Object.keys(favicons).find(
    (name) =>
      otp.label?.toLowerCase().startsWith(name) ||
      otp.issuer?.startsWith(name) ||
      otp.issuer?.endsWith(name) ||
      otp.name?.endsWith(name)
  );
  return (favicons as Record<string, string>)[name || "Unknown"];
};
