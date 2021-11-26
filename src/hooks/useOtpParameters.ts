import { OTP } from "../types";
import useLocalStorage from "./useLocalStorage";

export default function useOtpParameters() {
  return useLocalStorage<OTP[]>("otp-parameters");
}
