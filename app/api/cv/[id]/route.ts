import { authOptions } from "@/lib/auth";
import { r2 } from "@/lib/cloudflare-r2";
import { db } from "@/lib/db";
import { DeleteObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the CV to get the file name
    const cv = await db.cV.findUnique({
      where: { id: params.id },
    });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Delete the file from R2
    const fileName = cv.fileUrl.split("/").pop();
    const deleteCommand = new DeleteObjectCommand({
      Bucket: "accm",
      Key: fileName,
    });

    await r2.send(deleteCommand);

    // Delete the CV from the database
    await db.cV.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error("Error deleting CV:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
