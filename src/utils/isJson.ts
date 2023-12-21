export default function isJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}
