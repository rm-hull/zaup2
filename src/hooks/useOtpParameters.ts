import { useCallback } from "react";
import { merge } from "../otp";
import { type OTP } from "../types";
import { useLocalStorage, Serializer} from "@rm-hull/use-local-storage";
import usePassword from "./usePassword";
import CryptoJS from "crypto-js";

interface Options {
  includeArchived?: boolean;
}

interface UseOTPParametersReturnType {
  data?: OTP[];
  update: (...updates: OTP[]) => void;
  remove: (toRemove: OTP) => void;
  removeAll: () => void;
  error?: Error
}

class Encrypter implements Serializer<OTP[]> {
  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.password).toString();
  }

  public deserialize(value: string): OTP[] {
    const decrypted = CryptoJS.AES.decrypt(value, this.password).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as OTP[];
  };
}

export default function useOtpParameters(options?: Options): UseOTPParametersReturnType {
  const [password] = usePassword();
  const { value: otpParams, setValue: setOtpParams, error } = useLocalStorage<OTP[]>("zaup2.otp-parameters", { serializer: new Encrypter(password!)});

  const update = useCallback(
    (...updates: OTP[]) => {
      setOtpParams(merge(updates, otpParams));
    },
    [otpParams, setOtpParams]
  );

  const remove = useCallback(
    (toRemove: OTP) => {
      setOtpParams(otpParams?.filter((curr) => curr.issuer !== toRemove.issuer || curr.name !== toRemove.name));
    },
    [otpParams, setOtpParams]
  );

  const removeAll = useCallback(() => {
    setOtpParams(undefined);
  }, [setOtpParams]);

  const includeArchived = options?.includeArchived ?? false;

  return {
    data: includeArchived ? otpParams : otpParams?.filter((otp) => !(otp.archived ?? false)),
    update,
    remove,
    removeAll,
    error
  };
}
