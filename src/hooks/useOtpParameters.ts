import { OTP } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useOtpParameters(): [OTP[] | undefined, (value: OTP[] | undefined) => void] {
  return useLocalStorage<OTP[]>("otp-parameters");
}
