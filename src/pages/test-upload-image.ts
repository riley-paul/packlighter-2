import env from "@/envs";
import type { APIRoute } from "astro";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_ACCESS_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  console.log(file);

  return new Response("Image uploaded");
};
