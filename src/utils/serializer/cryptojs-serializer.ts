import { OTP } from "@/types";
import { Serializer } from "@rm-hull/use-local-storage";
import CryptoJS from "crypto-js";

export class CryptoJsSerializer implements Serializer<OTP[]> {
  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value, this.replacer), this.password).toString();
  }

  public deserialize(value: string): OTP[] {
    try {
      const decrypted = CryptoJS.AES.decrypt(value, this.password).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted, this.reviver) as OTP[];
    } catch (error: unknown) {
      throw new Error("Failed to decrypt OTP data. Bad password?", { cause: error });
    }
  }

  private replacer = (_key: string, value: unknown): unknown => {
    if (value instanceof Uint8Array) {
      return { type: "Uint8Array", data: Array.from(value) };
    }
    if (typeof value === "bigint") {
      return { type: "bigint", value: value.toString() };
    }
    return value;
  };

  private reviver = (_key: string, value: unknown): unknown => {
    if (value && typeof value === "object" && value !== null && "type" in value) {
      const obj = value as { type: string; data?: number[]; value?: string };
      if (obj.type === "Uint8Array" && Array.isArray(obj.data)) {
        return new Uint8Array(obj.data);
      }
      if (obj.type === "bigint" && typeof obj.value === "string") {
        return BigInt(obj.value);
      }
    }
    return value;
  };
}
