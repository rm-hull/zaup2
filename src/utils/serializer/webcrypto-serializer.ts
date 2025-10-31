import { OTP } from "@/types";
import { Serializer } from "@rm-hull/use-local-storage";
import CryptoJS from "crypto-js";

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

// Type for derived key and IV
interface KeyIV {
  key: Uint8Array;
  iv: Uint8Array;
}

/**
 * Replicates OpenSSL's EVP_BytesToKey derivation (MD5-based)
 * Used internally by CryptoJS.AES.encrypt/decrypt with a password string.
 */
async function evpBytesToKey(password: string, salt: Uint8Array, keyLen = 32, ivLen = 16): Promise<KeyIV> {
  const pwBytes = str2ab(password);
  let prev = new Uint8Array(0);
  const buffers: Uint8Array[] = [];

  while (buffers.reduce((sum, b) => sum + b.length, 0) < keyLen + ivLen) {
    const data = new Uint8Array(prev.length + pwBytes.length + salt.length);
    data.set(prev);
    data.set(pwBytes, prev.length);
    data.set(salt, prev.length + pwBytes.length);

    const hash = await crypto.subtle.digest("MD5", data);
    prev = new Uint8Array(hash);
    buffers.push(prev);
  }

  const keyiv = new Uint8Array(buffers.flat());
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

  const { key, iv } = await evpBytesToKey(password, salt);

  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, cryptoKey, ciphertext);

  return ab2str(decrypted);
}

export class WebCryptoSerializer implements Serializer<OTP[]> {
  constructor(private readonly password: string) {}

  public serialize(value: OTP[]): string {
    return CryptoJS.AES.encrypt(JSON.stringify(value), this.password).toString();
  }

  public async deserialize(value: string): Promise<OTP[]> {
    const decrypted = await decryptCryptoJS(value, this.password);
    if (!decrypted) {
      throw new Error("Failed to decrypt OTP data. Bad password?");
    }
    return JSON.parse(decrypted) as OTP[];
  }
}
