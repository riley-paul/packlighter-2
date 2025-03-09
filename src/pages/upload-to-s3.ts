import { uploadImageToS3 } from "@/lib/upload-image-to-s3";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new Response("No file found", { status: 400 });
  }

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);

  const result = await uploadImageToS3({
    file: fileBuffer,
    fileName: file.name,
    fileType: file.type,
  });

  if (result.success) {
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        contentType: "application/json",
      },
    });
  }

  return new Response(JSON.stringify(result), {
    status: 500,
  });
};
