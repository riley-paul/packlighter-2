import { expect, test } from "vitest";
import { uploadImageToS3 } from "./upload-image-to-s3";
import { readFile } from "fs/promises";

test("Upload image to S3", async () => {
  const file = await readFile("src/__test__/test-file.png");
  const result = await uploadImageToS3({
    file,
    fileName: "test-file.png",
    fileType: "image/png",
  });
  expect(result.success).toBe(true);
});
