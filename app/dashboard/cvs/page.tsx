import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CVList } from "@/components/cv-list";
import { getR2Url } from "@/lib/cloudflare-r2";

export default async function UserCVsPage() {
  const session = await getServerSession(authOptions);

  const cvs = await Promise.all(
    (
      await db.cV.findMany({
        where: { userId: session!.user!.id },
        orderBy: { uploadedAt: "desc" },
      })
    ).map(async (cv) => ({
      ...cv,
      uploadedAt: cv.uploadedAt.toISOString(),
      fileUrl: await getR2Url(cv.fileUrl),
    }))
  );

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My CVs</h1>
      <CVList initialCvs={cvs} />
    </div>
  );
}
