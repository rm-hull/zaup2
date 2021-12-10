import { OTP } from "../types";
import useLocalStorage from "./useLocalStorage";

type UseOTPParametersReturnType = {
  data: OTP[];
  update: (...updates: OTP[]) => void;
  remove: (toRemove: OTP) => void;
};

export default function useOtpParameters(): UseOTPParametersReturnType {
  const [otpParams, setOtpParams] = useLocalStorage<OTP[]>("otp-parameters");

  const update = (...updates: OTP[]) => {
    setOtpParams(
      updates.reduce((acc: OTP[], curr: OTP) => {
        const found = acc?.findIndex((otp) => otp.issuer === curr.issuer && otp.name === curr.name);
        if (found >= 0) {
          acc[found] = { ...acc[found], ...curr };
          return acc;
        }
        return [...acc, curr];
      }, otpParams ?? [])
    );
  };

  const remove = (toRemove: OTP) => {
    setOtpParams(otpParams?.filter((curr) => curr.issuer !== toRemove.issuer && curr.name !== toRemove.name));
  };

  return {
    data: otpParams ?? [],
    update,
    remove,
  };
}
