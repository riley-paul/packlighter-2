import { expect, test } from "vitest";
import { uploadImageToS3 } from "./upload-image-to-s3";
import { readFile } from "fs/promises";

test("Upload image to S3", async () => {
  const file = await readFile("./test_file.png");
  const fileBlob = new Blob([file]);
  const fileObject = new File([fileBlob], "test_file.png", {
    type: "image/png",
  });
  const result = await uploadImageToS3(fileObject);
  expect(result.success).toBe(true);
});
