import axios from "axios";

interface GoogleDriveResponse {
  id: string;
  kind: string;
  mimeType: string;
  name: string;
}

export async function uploadFile(
  accessToken: string,
  fileName: string,
  mimeType: string,
  fileContent: string,
  parent: string = "root"
): Promise<GoogleDriveResponse> {
  const metadata = {
    // TODO: id ?
    name: fileName,
    mimeType: mimeType,
    parents: [parent], // Google Drive folder id
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", new Blob([fileContent], { type: mimeType }));

  const resp = await axios.post<GoogleDriveResponse>(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",
    form,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return resp.data;
}
