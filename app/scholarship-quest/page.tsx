import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CareerGuidanceQuest } from "@/components/scholarship-quest-game";
import { GraduationCap } from "lucide-react";

export default async function ScholarshipQuestPage() {
  const session = await getServerSession(authOptions);

  const user = await db.user.findUnique({
    where: { id: session!.user!.id },
    include: { scholarshipAssessment: true },
  });

  return (
    <div className="min-h-screen">
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scholarship Quest
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Embark on a journey to discover your scholarship potential!
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full">
            <CareerGuidanceQuest />
          </div>
        </div>
      </div>
    </div>
  );
}