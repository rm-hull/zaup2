import { expect, test, describe } from "vitest";
import { CryptoJsSerializer } from "./cryptojs-serializer";
import { WebCryptoSerializer } from "./webcrypto-serializer";
import { type OTP } from "@/types";
import { MigrationPayload } from "@/proto/migration_payload";

const password = "my-super-secret-password";
const testData: OTP[] = [
  {
    name: "Test OTP",
    issuer: "Tester",
    secret: new Uint8Array([1, 2, 3, 4, 5]),
    type: MigrationPayload.OtpType.OTP_TYPE_TOTP,
    digits: MigrationPayload.DigitCount.DIGIT_COUNT_SIX,
    algorithm: MigrationPayload.Algorithm.ALGORITHM_SHA1,
    counter: 0,
  },
];

// Helper function to convert the object-based secret back to Uint8Array
const fixSecretType = (data: OTP[]): OTP[] => {
  return data.map((otp) => {
    if (otp.secret && !(otp.secret instanceof Uint8Array)) {
      // It's an object like { '0': 1, '1': 2, ... }, convert it back
      return { ...otp, secret: new Uint8Array(Object.values(otp.secret)) };
    }
    return otp;
  });
};

describe("Serializer Compatibility", () => {
  test("should serialize with CryptoJsSerializer and deserialize with WebCryptoSerializer", async () => {
    const cryptoJsSerializer = new CryptoJsSerializer(password);
    const encryptedData = cryptoJsSerializer.serialize(testData);

    const webCryptoSerializer = new WebCryptoSerializer(password);
    let decryptedData = await webCryptoSerializer.deserialize(encryptedData);
    decryptedData = fixSecretType(decryptedData);

    expect(decryptedData).toEqual(testData);
  });

  test("should serialize with WebCryptoSerializer and deserialize with CryptoJsSerializer", async () => {
    const cryptoJsSerializer = new CryptoJsSerializer(password);
    const initialEncryptedData = cryptoJsSerializer.serialize(testData);

    const webCryptoSerializer = new WebCryptoSerializer(password);
    await webCryptoSerializer.deserialize(initialEncryptedData);

    const webCryptoEncryptedData = webCryptoSerializer.serialize(testData);

    let decryptedData = cryptoJsSerializer.deserialize(webCryptoEncryptedData);
    decryptedData = fixSecretType(decryptedData);

    expect(decryptedData).toEqual(testData);
  });
});
