import env from "@/envs";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Readable } from "stream";

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

type UploadImageToS3Props = {
  file: Buffer | Readable;
  fileName: string;
  fileType: string;
};

export const uploadImageToS3 = async ({
  file,
  fileName,
  fileType,
}: UploadImageToS3Props) => {
  const fileExt = path.extname(fileName);
  const fileKey = `uploads/${crypto.randomUUID()}${fileExt}`;

  const putCommand = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: fileKey,
    Body: file,
    ContentType: fileType,
  });

  try {
    await s3.send(putCommand);
    return { success: true, imageUrl: getS3ObjectUrl(fileKey), fileKey };
  } catch (e) {
    const error = e as Error;
    console.error("Error uploading image to S3", error);
    return { success: false, error };
  }
};
