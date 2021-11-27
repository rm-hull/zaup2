import { OTP } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useOtpParameters(): [OTP[], (...updates: OTP[]) => void] {
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

  return [otpParams ?? [], update];
}
