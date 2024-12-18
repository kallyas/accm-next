import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: "accm",
    Key: fileName,
    Body: file,
    ContentType: contentType,
  });

  await r2.send(command);

  return fileName;
}

export async function getR2Url(fileName: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: "accm",
    Key: fileName,
  });

  const url = await getSignedUrl(r2, command, {
    expiresIn: 60 * 60 * 24 * 7, // 1 year
  });
  
  return url;
}
