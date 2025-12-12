import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  successResponse,
  requireAuth,
  validationError,
  parseBody,
  handleApiError,
} from "@/lib/mobile-api-utils";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    // Validate required environment variables
    if (!process.env.R2_BUCKET_NAME) {
      return handleApiError(
        new Error("R2_BUCKET_NAME environment variable is not configured")
      );
    }

    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await parseBody(req);

    if (!body) {
      return validationError("Invalid request body");
    }

    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return validationError("fileName and fileType are required");
    }

    // Validate file type (images only)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(fileType)) {
      return validationError("Invalid file type. Only images are allowed.");
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `payment-proofs/${authResult.id}/${timestamp}-${sanitizedFileName}`;

    // Generate pre-signed URL for upload
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return successResponse({
      uploadUrl,
      fileUrl,
      key,
      message: "Upload URL generated successfully",
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
