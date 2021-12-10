import * as R from "ramda";
import { OTP } from "./types";

export const normalize = (otp: OTP): OTP => {
  const posn = otp.name?.indexOf(":") ?? -1;

  return {
    ...otp,
    issuer: (posn >= 0 ? otp.name?.slice(0, posn) : otp.issuer) ?? "Unknown",
    name: posn >= 0 ? otp.name?.slice(posn + 1) : otp.name,
  };
};

export const sort = R.sortBy<OTP>((otp) => (otp.label ?? otp.issuer ?? "Unknown").toLowerCase());
