import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PersonalDiscovery } from "@/components/personal-discovery";

export default async function PersonalDiscoveryPage() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { personalDiscovery: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Personal Discovery</h1>
      <PersonalDiscovery personalDiscovery={user.personalDiscovery} />
    </div>
  );
}
