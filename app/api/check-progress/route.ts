import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProgressStatus, SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

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
      cvs: { take: 1 },
      scholarshipAssessment: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let newStatus = user.progressStatus;

  switch (user.progressStatus) {
    case ProgressStatus.PAYMENT_PENDING:
      if (
        user.subscriptions.some(
          (sub) => sub.status === SubscriptionStatus.ACTIVE
        )
      ) {
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

  return NextResponse.json({ progressStatus: newStatus });
}
