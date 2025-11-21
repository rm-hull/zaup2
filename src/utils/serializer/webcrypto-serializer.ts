import { OTP } from "@/types";
import { Serializer } from "@rm-hull/use-local-storage";
import CryptoJS, { type WordArray } from "crypto-js";

// Utility: Convert string to Uint8Array
function str2ab(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Utility: Convert ArrayBuffer to string
function ab2str(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

// Utility: Base64 decode
function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToWordArray(u8a: Uint8Array): WordArray {
  return CryptoJS.lib.WordArray.create(u8a as unknown as number[]);
}

function wordArrayToUint8Array(wa: WordArray): Uint8Array {
  const l = wa.sigBytes;
  const u8_array = new Uint8Array(l);
  for (let i = 0; i < l; i++) {
    u8_array[i] = (wa.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }
  return u8_array;
}

// Type for derived key and IV
interface KeyIV {
  key: Uint8Array;
  iv: Uint8Array;
}

/**
 * Replicates OpenSSL's EVP_BytesToKey derivation (MD5-based)
 * Used internally by CryptoJS.AES.encrypt/decrypt with a password string.
 */
function evpBytesToKey(password: string, salt: Uint8Array, keyLen = 32, ivLen = 16): KeyIV {
  const pwBytes = str2ab(password);
  let prev = new Uint8Array(0);
  const buffers: Uint8Array[] = [];
  let currentLength = 0;

  while (currentLength < keyLen + ivLen) {
    const data = new Uint8Array(prev.length + pwBytes.length + salt.length);
    data.set(prev);
    data.set(pwBytes, prev.length);
    data.set(salt, prev.length + pwBytes.length);

    const hash = CryptoJS.MD5(uint8ArrayToWordArray(data));
    prev = wordArrayToUint8Array(hash);
    buffers.push(prev);
    currentLength += prev.length;
  }

  const totalLength = keyLen + ivLen;
  const keyiv = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    if (offset + buffer.length <= totalLength) {
      keyiv.set(buffer, offset);
      offset += buffer.length;
    } else {
      keyiv.set(buffer.slice(0, totalLength - offset), offset);
      offset = totalLength;
      break;
    }
  }
  return {
    key: keyiv.slice(0, keyLen),
    iv: keyiv.slice(keyLen, keyLen + ivLen),
  };
}

/**
 * Decrypts AES-CBC data encrypted by CryptoJS.AES.encrypt(data, password)
 */
export async function decryptCryptoJS(ciphertextBase64: string, password: string): Promise<string> {
  const data = base64ToBytes(ciphertextBase64);

  // Check for "Salted__" header
  const prefix = String.fromCharCode(...data.slice(0, 8));
  if (prefix !== "Salted__") {
    throw new Error("Invalid CryptoJS salt header");
  }

  const salt = data.slice(8, 16);
  const ciphertext = data.slice(16);

  const { key, iv } = evpBytesToKey(password, salt);

  // @ts-expect-error
  const cryptoKey = await crypto.subtle.importKey("raw", new Uint8Array(key.buffer), { name: "AES-CBC" }, false, [
    "decrypt",
  ]);
  // @ts-expect-error
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: new Uint8Array(iv.buffer) },
    cryptoKey,
    new Uint8Array(ciphertext.buffer)
  );

  return ab2str(decrypted);
}

export class WebCryptoSerializer implements Serializer<OTP[]> {
  #isPasswordBad: boolean = true;

  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    if (this.#isPasswordBad) {
      throw new Error("Unable to encrypt data: Password is incorrect or unverified");
    }
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.password).toString();
  }

  public async deserialize(value: string): Promise<OTP[]> {
    try {
      const decrypted = await decryptCryptoJS(value, this.password);
      const data = JSON.parse(decrypted) as OTP[];
      this.#isPasswordBad = false;
      return data;
    } catch (err) {
      this.#isPasswordBad = true;
      throw new Error("Failed to decrypt OTP data. Bad password?", { cause: err });
    }
  }
}
