import { test } from "vitest";
import fs from "fs/promises";
import processImage from "./process-image";

test("image processing", async () => {
  const file = await fs.readFile("src/tests/files/WCJKTVw.png");
  const processed = await processImage(
    new File([file], "WCJKTVw.png", { type: "image/png" }),
  );
  await fs.writeFile("src/tests/files/WCJKTVw.webp", Buffer.from(processed));
});
