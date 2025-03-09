import { expect, test } from "vitest";
import { uploadImageToS3 } from "./upload-image-to-s3";
import { File } from "fetch-blob/file";
import { readFile } from "fs/promises";

async function fileFromFs(
  filePath: string,
  fileName: string,
  mimeType = "application/octet-stream",
) {
  try {
    const fileBuffer = await readFile(filePath);
    const file = new File([fileBuffer], fileName, { type: mimeType });

    return file;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

test("Upload image to S3", async () => {
  const file = await fileFromFs(
    "./test_file.png",
    "test_file.png",
    "image/png",
  );
  const result = await uploadImageToS3(file);
  expect(result.success).toBe(true);
});
