import axios from "axios"

interface IpifyResponse {
  ip: string
};

export async function ipAddress(): Promise<string> {
  const resp = await axios.get<IpifyResponse>("https://api.ipify.org?format=json")
  return resp.data.ip
}