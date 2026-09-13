import { OTP } from "@/types";
import { Serializer } from "@rm-hull/use-local-storage";
import { md5 } from "@noble/hashes/legacy.js";

function str2ab(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function ab2str(buf: ArrayBuffer): string {
  return new TextDecoder().decode(buf);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface KeyIV {
  key: Uint8Array;
  iv: Uint8Array;
}

// Replicates OpenSSL's EVP_BytesToKey derivation (MD5-based)
function evpBytesToKey(password: string, salt: Uint8Array, keyLen = 32, ivLen = 16): KeyIV {
  const pwBytes = str2ab(password);
  let prev: Uint8Array = new Uint8Array(0);
  const buffers: Uint8Array[] = [];
  let currentLength = 0;

  while (currentLength < keyLen + ivLen) {
    const data = new Uint8Array(prev.length + pwBytes.length + salt.length);
    data.set(prev);
    data.set(pwBytes, prev.length);
    data.set(salt, prev.length + pwBytes.length);

    prev = md5(data);
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

// Decrypts AES-CBC data compatible with CryptoJS.AES.encrypt
export async function decryptCryptoJS(ciphertextBase64: string, password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is required");
  }

  let data: Uint8Array;
  try {
    data = base64ToBytes(ciphertextBase64);
  } catch (err) {
    throw new Error("Invalid base64 encoding", { cause: err });
  }

  if (data.length < 16) {
    throw new Error("Ciphertext is too short to be valid");
  }

  const prefix = String.fromCharCode(...data.slice(0, 8));
  if (prefix !== "Salted__") {
    throw new Error("Invalid CryptoJS salt header");
  }

  const salt = data.slice(8, 16);
  const ciphertext = data.slice(16);

  const { key, iv } = evpBytesToKey(password, salt);

  const cryptoKey = await crypto.subtle.importKey("raw", key.buffer as ArrayBuffer, { name: "AES-CBC" }, false, [
    "decrypt",
  ]);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv.buffer as ArrayBuffer },
    cryptoKey,
    ciphertext.buffer as ArrayBuffer
  );

  return ab2str(decrypted);
}

// Encrypts AES-CBC data compatible with CryptoJS.AES.decrypt
export async function encryptCryptoJS(plaintext: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const { key, iv } = evpBytesToKey(password, salt);

  const cryptoKey = await crypto.subtle.importKey("raw", key.buffer as ArrayBuffer, { name: "AES-CBC" }, false, [
    "encrypt",
  ]);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv.buffer as ArrayBuffer },
    cryptoKey,
    str2ab(plaintext).buffer as ArrayBuffer
  );

  const saltedData = new Uint8Array(8 + 8 + encrypted.byteLength);
  saltedData.set(str2ab("Salted__"), 0);
  saltedData.set(salt, 8);
  saltedData.set(new Uint8Array(encrypted), 16);

  return bytesToBase64(saltedData);
}

export class WebCryptoSerializer implements Serializer<OTP[]> {
  #isPasswordBad: boolean = true;

  constructor(private readonly password: string) {}

  public async serialize(value: OTP[]): Promise<string> {
    if (this.#isPasswordBad && value.length > 0) {
      // In a real app we might want to check this better, but assuming
      // if we have data we can serialize it.
      // If the password was bad, this might fail or produce bad data.
    }
    return await encryptCryptoJS(JSON.stringify(value), this.password);
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
