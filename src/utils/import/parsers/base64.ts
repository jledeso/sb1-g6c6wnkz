export function parseBase64JSON<T>(base64String: string): T | undefined {
  try {
    const jsonString = atob(base64String);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing base64 JSON:', error);
    return undefined;
  }
}