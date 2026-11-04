/**
 * Uploaded images are downscaled before they go into localStorage, which has
 * a few megabytes of room. The API stores files on disk instead.
 */
export async function imageToDataUrl(file: File, maxSize: number): Promise<string> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return readAsDataUrl(file);
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    return readAsDataUrl(file);
  }
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

/** Same checks as FileUploadValidation in the API. Returns an error message or null. */
export function validateImage(file: unknown): string | null {
  if (!(file instanceof File) || file.size === 0) {
    return "Görsel boş veya yüklenmedi.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Görsel 5MB'dan büyük olamaz.";
  }
  if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
    return "Desteklenmeyen format. JPEG, PNG, WEBP veya GIF kullanın.";
  }
  return null;
}
