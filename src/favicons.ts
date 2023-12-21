import favicons from "./assets/favicons.json";
import { type OTP } from "./types";

export const getCachedFavicon = (otp: OTP): string | undefined => {
  if (otp.favicon !== undefined) {
    return otp.favicon;
  }

  const name = Object.keys(favicons).find((name) => {
    const lcName = name.toLowerCase();
    return (
      otp.label?.toLowerCase().startsWith(lcName) === true ||
      otp.issuer?.toLowerCase().startsWith(lcName) === true ||
      otp.issuer?.toLowerCase().endsWith(lcName) === true ||
      otp.name?.toLowerCase().endsWith(lcName) === true
    );
  });

  if (name === undefined) {
    return undefined;
  }

  const url = new URL((favicons as Record<string, string>)[name]);
  return `/zaup2/favicons/${url.hostname}${url.pathname}`;
};
