import axios from "axios";
import { type OTP } from "../types";
import { type GeneralSettings } from "../hooks/useGeneralSettings";

interface File {
  id: string;
  kind: string;
  mimeType: string;
  name: string;
}

interface ListFiles {
  nextPageToken: string;
  kind: string;
  incompleteSearch: boolean;
  files: File[];
}

export interface Payload {
  settings: GeneralSettings;
  otp: OTP[];
  lastSync?: {
    on: string;
    from: string;
    url: string;
  };
}

export class GoogleDrive {
  readonly #accessToken: string;
  readonly #filename: string;
  #id: string | undefined;

  constructor(accessToken: string, filename: string) {
    this.#accessToken = accessToken;
    this.#filename = filename;
  }

  private async list(): Promise<File[]> {
    const resp = await axios.get<ListFiles>("https://www.googleapis.com/drive/v3/files", {
      headers: this.headers,
      params: {
        spaces: "appDataFolder",
        q: `name='${this.#filename}'`,
      },
    });
    return resp.data.files;
  }

  async download(): Promise<Payload> {
    const [file] = await this.list();
    if (file === undefined) {
      return {
        otp: [],
        settings: {},
      };
    }

    this.#id = file.id;
    const resp = await axios.get<Payload>(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
      headers: this.headers,
      params: {
        alt: "media",
      },
    });

    return resp.data;
  }

  async upload(payload: Payload): Promise<File> {
    const metadata = {
      name: this.#filename,
      description: "ZAUP 2.0 Sync data",
      contentType: "application/json; charset=UTF-8",
      mimeType: "application/json; charset=UTF-8",
      parents: this.#id === undefined ? ["root"] : undefined, // Google Drive folder id
    };

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json; charset=UTF-8" }));
    form.append("file", new Blob([JSON.stringify(payload, null, 2)], { type: "application/json; charset=UTF-8" }));

    const options = {
      headers: this.headers,
      params: {
        uploadType: "multipart",
        supportsAllDrives: true,
      },
    };

    const resp =
      this.#id === undefined
        ? await axios.post<File>("https://www.googleapis.com/upload/drive/v3/files", form, options)
        : await axios.patch<File>(`https://www.googleapis.com/upload/drive/v3/files/${this.#id}`, form, options);

    return resp.data;
  }

  private get headers(): Record<string, string> {
    return {
      // Accept: "application/json; charset=UTF-8",
      Authorization: `Bearer ${this.#accessToken}`,
    };
  }
}
