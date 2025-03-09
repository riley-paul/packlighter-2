import env from "@/envs";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_ACCESS_SECRET,
  },
});

export const getS3ObjectUrl = (key: string) => {
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
};

export const uploadImageToS3 = async (file: File) => {
  // Prepare file for S3 upload
  const fileExt = path.extname(file.name);
  const fileName = `${crypto.randomUUID()}${fileExt}`;
  const fileKey = `uploads/${fileName}`;

  const putCommand = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: file,
    ContentLength: file.size,
    ContentType: file.type,
    ACL: "public-read", // Make the file publicly accessible
  });

  try {
    // Upload to S3
    await s3.send(putCommand);
    return { success: true, imageUrl: getS3ObjectUrl(fileKey) };

    // Return the public URL of the uploaded file
  } catch (e) {
    const error = e as Error;
    console.error("Error uploading image to S3", error);
    return { success: false, error };
  }
};
