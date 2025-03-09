import uploadImageToS3 from "@/lib/upload-image-to-s3";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("image") as File;

  console.log(file);

  await uploadImageToS3(file);

  return new Response("Image uploaded");
};
