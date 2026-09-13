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

  test("should throw an error when deserializing with a wrong password", async () => {
    const serializer = new WebCryptoSerializer(password);
    const encryptedData = await serializer.serialize(testData);

    const badSerializer = new WebCryptoSerializer("wrong-password");
    await expect(badSerializer.deserialize(encryptedData)).rejects.toThrow(
      /Failed to decrypt or parse OTP data/i
    );
  });

  test("should decrypt a known ciphertext produced by CryptoJS (EVP_BytesToKey)", async () => {
    // This ciphertext was generated using:
    // password: "my-super-secret-password"
    // salt: [1, 2, 3, 4, 5, 6, 7, 8]
    // plaintext: JSON.stringify([ { "$typeName": "MigrationPayload.OtpParameters", "name": "Test OTP", "issuer": "Tester", "secret": { "0": 1, "1": 2, "2": 3, "3": 4, "4": 5 }, "type": 2, "digits": 1, "algorithm": 1, "counter": 0 } ])
    const ciphertext = "U2FsdGVkX18BAgMEBQYHCEghauPxDbJ8X5bK2aMa91cMsf1U2lPvrf8GeX+/BN+QaiXNJHldIjBoiJFhGc2qB00Cn6KIv7eunf51wQf7rO44vCZRj/mE1/1RhkDVINas7lw5bqC2Kq5ecmKPlUXewRbbw9Kbs/loLEYRggfQXhEvm1jGoL9klHQMBqVPz87hrucgm8wTW1RlUj0lLRK9qZOLHLQ0ZEegQQoMh5AFxIraYu4YrodzEAZAeDp0x2gT";
    
    const serializer = new WebCryptoSerializer(password);
    let decryptedData = await serializer.deserialize(ciphertext);
    decryptedData = fixSecretType(decryptedData);

    expect(decryptedData).toEqual(testData);
  });
});
