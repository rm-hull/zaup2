export default function isJson(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}
