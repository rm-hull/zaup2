import { OTP } from "@/types";
import { Serializer } from "@rm-hull/use-local-storage";
import CryptoJS from "crypto-js";

export class CryptoJsSerializer implements Serializer<OTP[]> {
  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.password).toString();
  }

  public deserialize(value: string): OTP[] {
    try {
      const decrypted = CryptoJS.AES.decrypt(value, this.password).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted) as OTP[];
    } catch (error: unknown) {
      throw new Error("Failed to decrypt OTP data. Bad password?", { cause: error });
    }
  }
}
