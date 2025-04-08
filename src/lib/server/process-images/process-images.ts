import decodeJpeg, { init as initJpegWasm } from "@jsquash/jpeg/decode";
import decodePng, { init as initPngWasm } from "@jsquash/png/decode";
import encodeWebp, { init as initWebpWasm } from "@jsquash/webp/encode";

// @ts-ignore
import JPEG_DEC_WASM from "./wasm/mozjpeg_dec.wasm";
// @ts-ignore
import PNG_DEC_WASM from "./wasm/squoosh_png_bg.wasm";
// @ts-ignore
import WEBP_ENC_WASM from "./wasm/webp_enc_simd.wasm";

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

  // Encode the image to WebP
  await initWebpWasm(WEBP_ENC_WASM);
  const webpData = encodeWebp(data, {
    quality: 75,
  });

  return webpData;
}
