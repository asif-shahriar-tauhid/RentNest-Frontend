/* eslint-disable @typescript-eslint/no-explicit-any */
export async function uploadToImgBB(
  file: File,
  customApiKey?: string,
): Promise<string> {
  const apiKey =
    customApiKey ||
    process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
    (process.env as any).IMGBB_API_KEY;

  // Helper to convert file to Base64 Data URL as a reliable fallback
  const convertToDataUrl = (fileObj: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to process image file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(fileObj);
    });
  };

  if (!apiKey || apiKey === "YOUR_IMGBB_API_KEY") {
    return convertToDataUrl(file);
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.warn("ImgBB API upload failed:", data.error?.message);
      // Fallback to Data URL if ImgBB API key is invalid/forbidden
      return convertToDataUrl(file);
    }

    return data.data.url;
  } catch (error) {
    console.warn("ImgBB API upload error, falling back to local photo:", error);
    return convertToDataUrl(file);
  }
}
