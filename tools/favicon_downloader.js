import fs from "fs";
import axios from "axios";
import path from "path";

const fsp = fs.promises;

async function download(urlString, name) {
  const url = new URL(urlString);
  console.log(`Fetching: ${urlString}`);

  const response = await axios.get(urlString, { responseType: "arraybuffer" });

  await fsp.mkdir(`./public/favicons/${url.hostname}/${path.dirname(url.pathname)}`, { recursive: true });
  await fsp.writeFile(`./public/favicons/${url.hostname}/${url.pathname}`, Buffer.from(response.data));
}

async function process() {
  const contents = await fsp.readFile("./src/assets/favicons.json", "utf-8");
  const favicons = JSON.parse(contents);

  for (const [name, url] of Object.entries(favicons)) {
    await download(url, name);
  }
}

process().catch(console.error)