import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";
import decodeWebp, { init as initWebpDecWasm } from "@jsquash/webp/decode";
import resize, { initResize } from "@jsquash/resize";

// @ts-ignore
import JPEG_DEC_WASM from "./wasm/mozjpeg_dec.wasm";
// @ts-ignore
import PNG_DEC_WASM from "./wasm/squoosh_png_bg.wasm";
// @ts-ignore
import WEBP_ENC_WASM from "./wasm/webp_enc_simd.wasm";
// @ts-ignore
import WEBP_DEC_WASM from "./wasm/webp_dec.wasm";
// @ts-ignore
import RESIZE_WASM from "./wasm/squoosh_resize_bg.wasm";

const decodeImage = async (buffer: ArrayBuffer, format: string) => {
  if (format === "jpeg" || format === "jpg") {
    await initJpegWasm(JPEG_DEC_WASM);
    return decodeJpeg(buffer);
  }

  if (format === "png") {
    await initPngWasm(PNG_DEC_WASM);
    return decodePng(buffer);
  }

  if (format === "webp") {
    await initWebpDecWasm(WEBP_DEC_WASM);
    return decodeWebp(buffer);
  }

  throw new Error(`Unsupported format: ${format}`);
};

const downsizeImage = async (data: ImageData, maxSize: number = 800) => {
  const width = data.width;
  const height = data.height;
  const ratio = Math.min(maxSize / width, maxSize / height);

  if (ratio >= 1) {
    // No need to downsize
    return data;
  }

  const newWidth = Math.floor(width * ratio);
  const newHeight = Math.floor(height * ratio);

  await initResize(RESIZE_WASM);
  const resizedData = await resize(data, {
    width: newWidth,
    height: newHeight,
  });
  return resizedData;
};

export default async function processImage(file: File) {
  const buffer = await file.arrayBuffer();
  const format = file.type.split("/")[1];

  // Decode the image
  const data = await decodeImage(buffer, format);

  // Downsize the image
  const resizedData = await downsizeImage(data, 800);

  // Encode the image to WebP
  await initWebpWasm(WEBP_ENC_WASM);
  const webpData = encodeWebp(resizedData, {
    quality: 75,
  });

  return webpData;
}
