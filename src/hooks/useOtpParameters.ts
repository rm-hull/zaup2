import { useCallback, useMemo } from "react";
import { OTP } from "../types";
import useLocalStorage from "./useLocalStorage";

type Options = {
  includeArchived?: boolean;
};

type UseOTPParametersReturnType = {
  data: OTP[];
  update: (...updates: OTP[]) => void;
  remove: (toRemove: OTP) => void;
};

export default function useOtpParameters(options?: Options): UseOTPParametersReturnType {
  const [otpParams, setOtpParams] = useLocalStorage<OTP[]>("otp-parameters");

  const data = useMemo(() => otpParams || [], [otpParams]);

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
        }, data)
      );
    },
    [data, setOtpParams]
  );

  const remove = useCallback(
    (toRemove: OTP) => {
      setOtpParams(data?.filter((curr) => curr.issuer !== toRemove.issuer && curr.name !== toRemove.name));
    },
    [data, setOtpParams]
  );

  return {
    data: options?.includeArchived ? data : data.filter((otp) => !otp.archived),
    update,
    remove,
  };
}
