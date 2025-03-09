import env from "@/envs";
import AWS from "aws-sdk";
import path from "path";

const s3 = new AWS.S3({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_ACCESS_SECRET,
});

export default async function uploadImageToS3(file: File) {
  // Prepare file for S3 upload
  const fileExt = path.extname(file.name);
  const fileName = `${crypto.randomUUID()}${fileExt}`;
  const fileBuffer = await file.arrayBuffer();

  const params: AWS.S3.PutObjectRequest = {
    Bucket: env.AWS_S3_BUCKET,
    Key: `uploads/${fileName}`, // File path in S3 bucket
    Body: fileBuffer,
    ContentType: file.type,
    ACL: "public-read", // Make the file publicly accessible
  };

  try {
    // Upload to S3
    const { Location: imageUrl } = await s3.upload(params).promise();
    return { success: true, imageUrl };

    // Return the public URL of the uploaded file
  } catch (e) {
    const error = e as Error;
    return { success: false, error };
  }
}
