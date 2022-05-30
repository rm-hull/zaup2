import base32Encode from "base32-encode";
import * as OTPAuth from "otpauth";
import * as R from "ramda";

import { MigrationPayload } from "./proto/migration_payload";
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

export const getAlgorithm = (alg?: MigrationPayload.Algorithm) => {
  switch (alg) {
    case MigrationPayload.Algorithm.ALGORITHM_MD5:
      return "MD5";
    case MigrationPayload.Algorithm.ALGORITHM_SHA1:
      return "SHA1";
    case MigrationPayload.Algorithm.ALGORITHM_SHA256:
      return "SHA256";
    case MigrationPayload.Algorithm.ALGORITHM_SHA512:
      return "SHA512";
    default:
      return undefined;
  }
};

export const getDigits = (digits?: MigrationPayload.DigitCount) => {
  switch (digits) {
    case MigrationPayload.DigitCount.DIGIT_COUNT_SIX:
      return 6;
    case MigrationPayload.DigitCount.DIGIT_COUNT_EIGHT:
      return 8;
    default:
      return undefined;
  }
};

export const getTotp = (otp?: OTP, encodedSecret?: string): OTPAuth.TOTP | undefined =>
  otp &&
  new OTPAuth.TOTP({
    issuer: otp.issuer,
    label: otp.name,
    algorithm: getAlgorithm(otp.algorithm),
    digits: getDigits(otp.digits),
    period: 30,
    secret: encodedSecret,
  });

export const getEncodedSecret = (otp?: OTP): string | undefined =>
  otp?.secret && base32Encode(Uint8Array.from(Object.values(otp.secret)), "RFC4648");
