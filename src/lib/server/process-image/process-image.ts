import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";
import resize, { initResize } from "@jsquash/resize";

// @ts-ignore
import JPEG_DEC_WASM from "./wasm/mozjpeg_dec.wasm";
// @ts-ignore
import PNG_DEC_WASM from "./wasm/squoosh_png_bg.wasm";
// @ts-ignore
import WEBP_ENC_WASM from "./wasm/webp_enc_simd.wasm";
// @ts-ignore
import RESIZE_WASM from "./wasm/squoosh_resize_bg.wasm";

const decodeImage = async (buffer: ArrayBuffer, format: string) => {
  if (format === "jpeg" || format === "jpg") {
    // @Note, we need to manually initialise the wasm module here from wasm import at top of file
    await initJpegWasm(JPEG_DEC_WASM);
    return decodeJpeg(buffer);
  }

  if (format === "png") {
    // @Note, we need to manually initialise the wasm module here from wasm import at top of file
    await initPngWasm(PNG_DEC_WASM);
    return decodePng(buffer);
  }

  throw new Error(`Unsupported format: ${format}`);
};

export default async function processImage(file: File) {
  const buffer = await file.arrayBuffer();
  const format = file.type.split("/")[1];

  // Decode the image
  const data = await decodeImage(buffer, format);

  // Downsize the image
  // Shortest side should be 800px
  const maxSize = 800;
  const width = data.width;
  const height = data.height;
  const ratio = Math.min(maxSize / width, maxSize / height);
  const newWidth = Math.floor(width * ratio);
  const newHeight = Math.floor(height * ratio);

  await initResize(RESIZE_WASM);
  const resizedData = await resize(data, {
    width: newWidth,
    height: newHeight,
  });

  // Encode the image to WebP
  await initWebpWasm(WEBP_ENC_WASM);
  const webpData = encodeWebp(resizedData, {
    quality: 75,
  });

  return webpData;
}
