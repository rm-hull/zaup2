import { expect, test, describe } from "vitest";
import { WebCryptoSerializer } from "./webcrypto-serializer";
import { type OTP } from "@/types";
import {
  MigrationPayload_Algorithm,
  MigrationPayload_DigitCount,
  MigrationPayload_OtpType,
} from "@/gen/migration_payload_pb";

const password = "my-super-secret-password";
const testData: OTP[] = [
  {
    $typeName: "MigrationPayload.OtpParameters",
    name: "Test OTP",
    issuer: "Tester",
    secret: new Uint8Array([1, 2, 3, 4, 5]),
    type: MigrationPayload_OtpType.TOTP,
    digits: MigrationPayload_DigitCount.SIX,
    algorithm: MigrationPayload_Algorithm.SHA1,
    counter: 0,
  },
];

// Helper function to convert the object-based secret back to Uint8Array
const fixSecretType = (data: OTP[]): OTP[] => {
  return data.map((otp) => {
    if (otp.secret && !(otp.secret instanceof Uint8Array)) {
      return { ...otp, secret: new Uint8Array(Object.values(otp.secret)) };
    }
    return otp;
  });
};

describe("WebCryptoSerializer", () => {
  test("should serialize and deserialize data correctly", async () => {
    const serializer = new WebCryptoSerializer(password);
    const encryptedData = await serializer.serialize(testData);

    const newSerializer = new WebCryptoSerializer(password);
    let decryptedData = await newSerializer.deserialize(encryptedData);
    decryptedData = fixSecretType(decryptedData);

    expect(decryptedData).toEqual(testData);
  });
});
