import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getR2Url, uploadToR2 } from "@/lib/cloudflare-r2";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `avatar-${session!.user!.id}-${Date.now()}-${file.name}`;
    const avatarUrl = await uploadToR2(buffer, fileName, file.type);

    const updatedUser = await db.user.update({
      where: { id: session!.user!.id },
      data: {
        profile: {
          upsert: {
            create: { avatar: avatarUrl },
            update: { avatar: avatarUrl },
          },
        },
      },
      include: { profile: true },
    });

    const updatedAvatarUrl = await getR2Url(updatedUser.profile?.avatar || "");

    return NextResponse.json({ avatarUrl: updatedAvatarUrl });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
