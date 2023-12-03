import { useCallback } from "react";
import { type OTP } from "../types";
import useLocalStorage from "./useLocalStorage";
import usePassword from "./usePassword";

interface Options {
  includeArchived?: boolean;
}

interface UseOTPParametersReturnType {
  data?: OTP[];
  update: (...updates: OTP[]) => void;
  remove: (toRemove: OTP) => void;
  removeAll: () => void;
}

export default function useOtpParameters(options?: Options): UseOTPParametersReturnType {
  const [password] = usePassword();
  const [otpParams, setOtpParams] = useLocalStorage<OTP[]>("zaup2.otp-parameters", password);

  const update = useCallback(
    (...updates: OTP[]) => {
      setOtpParams(
        updates.reduce((acc: OTP[], curr: OTP) => {
          const found = acc?.findIndex((otp) => otp.issuer === curr.issuer && otp.name === curr.name);
          if (found >= 0) {
            acc[found] = { ...acc[found], ...curr, lastUpdated: Date.now() };
            return acc;
          }
          return [...acc, { ...curr, created: Date.now() }];
        }, otpParams ?? [])
      );
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
  };
}
