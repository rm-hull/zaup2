import { useLocalStorage, Serializer } from "@rm-hull/use-local-storage";
import CryptoJS from "crypto-js";
import { useCallback } from "react";
import { merge } from "../otp";
import { type OTP } from "../types";
import usePassword from "./usePassword";

interface Options {
  includeArchived?: boolean;
}

interface UseOTPParametersReturnType {
  data?: OTP[];
  update: (...updates: OTP[]) => void;
  remove: (toRemove: OTP) => void;
  removeAll: () => void;
  error?: Error;
}

class Encrypter implements Serializer<OTP[]> {
  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.password).toString();
  }

  public deserialize(value: string): OTP[] {
    const decrypted = CryptoJS.AES.decrypt(value, this.password).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as OTP[];
  }
}

export default function useOtpParameters(options?: Options): UseOTPParametersReturnType {
  const [password] = usePassword();
  const {
    value: otpParams,
    setValue: setOtpParams,
    error,
  } = useLocalStorage<OTP[]>("zaup2.otp-parameters", { serializer: new Encrypter(password!), initialValue: [] });

  const update = useCallback(
    (...updates: OTP[]) => void setOtpParams(merge(updates, otpParams)),
    [otpParams, setOtpParams]
  );

  const remove = useCallback(
    (toRemove: OTP) =>
      void setOtpParams(otpParams?.filter((curr) => curr.issuer !== toRemove.issuer || curr.name !== toRemove.name)),
    [otpParams, setOtpParams]
  );

  const removeAll = useCallback(() => void setOtpParams(undefined), [setOtpParams]);

  const includeArchived = options?.includeArchived ?? false;

  return {
    data: includeArchived ? otpParams : otpParams?.filter((otp) => !(otp.archived ?? false)),
    update,
    remove,
    removeAll,
    error,
  };
}
