import { db } from "@/lib/db";
import { ProgressStatus } from "@prisma/client";

export async function checkAndUpdateProgress(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      progressStatus: true,
      subscriptions: {
        select: {
          status: true,
        },
      },
      personalDiscovery: true,
      cvs: { take: 1 }, // Check if at least one CV exists
      scholarshipAssessment: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let newStatus = user.progressStatus;

  switch (user.progressStatus) {
    case ProgressStatus.PAYMENT_PENDING:
      if (user.subscriptions.some((sub) => sub.status === "active")) {
        newStatus = ProgressStatus.PERSONAL_DISCOVERY_PENDING;
      }
      break;
    case ProgressStatus.PERSONAL_DISCOVERY_PENDING:
      if (user.personalDiscovery) {
        newStatus = ProgressStatus.CV_ALIGNMENT_PENDING;
      }
      break;
    case ProgressStatus.CV_ALIGNMENT_PENDING:
      if (user.cvs.length > 0) {
        newStatus = ProgressStatus.SCHOLARSHIP_MATRIX_PENDING;
      }
      break;
    case ProgressStatus.SCHOLARSHIP_MATRIX_PENDING:
      if (user.scholarshipAssessment) {
        newStatus = ProgressStatus.ESSAYS_PENDING;
      }
      break;
    // ... other stages
    default:
      break;
  }

  if (newStatus !== user.progressStatus) {
    await db.user.update({
      where: { id: userId },
      data: { progressStatus: newStatus },
    });
  }

  return newStatus;
}
