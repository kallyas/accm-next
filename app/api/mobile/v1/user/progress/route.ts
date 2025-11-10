import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  successResponse,
  requireAuth,
  handleApiError,
} from "@/lib/mobile-api-utils";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);

    if (authResult instanceof Response) {
      return authResult;
    }

    const user = await db.user.findUnique({
      where: { id: authResult.id },
      select: {
        progressStatus: true,
        personalDiscovery: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        scholarshipAssessment: {
          select: {
            id: true,
            createdAt: true,
          },
        },
        cvs: {
          select: {
            id: true,
            uploadedAt: true,
            fileName: true,
          },
          orderBy: {
            uploadedAt: "desc",
          },
          take: 1,
        },
        subscriptions: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            status: true,
            startDate: true,
            endDate: true,
            plan: {
              select: {
                name: true,
                features: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return handleApiError({ code: "P2025" });
    }

    // Calculate progress percentage
    const progressSteps = {
      PAYMENT_PENDING: 0,
      PERSONAL_DISCOVERY_PENDING: 20,
      CV_ALIGNMENT_PENDING: 40,
      SCHOLARSHIP_MATRIX_PENDING: 60,
      ESSAYS_PENDING: 80,
      COMPLETED: 100,
    };

    const progressPercentage = progressSteps[user.progressStatus] || 0;

    // Determine next steps
    const nextSteps = [];

    if (user.progressStatus === "PAYMENT_PENDING") {
      nextSteps.push({
        step: "subscription",
        title: "Complete Payment",
        description: "Subscribe to a plan to access all features",
        required: true,
      });
    }

    if (user.progressStatus === "PERSONAL_DISCOVERY_PENDING") {
      nextSteps.push({
        step: "personal_discovery",
        title: "Complete Personal Discovery",
        description: "Fill out your SWOT analysis and career aspirations",
        required: true,
      });
    }

    if (user.progressStatus === "CV_ALIGNMENT_PENDING") {
      nextSteps.push({
        step: "cv_upload",
        title: "Upload Your CV",
        description: "Upload and align your CV with career goals",
        required: true,
      });
    }

    if (user.progressStatus === "SCHOLARSHIP_MATRIX_PENDING") {
      nextSteps.push({
        step: "scholarship_assessment",
        title: "Complete Scholarship Matrix",
        description: "Fill out the scholarship assessment questionnaire",
        required: true,
      });
    }

    return successResponse({
      progressStatus: user.progressStatus,
      progressPercentage,
      nextSteps,
      completedSteps: {
        hasSubscription: user.subscriptions.length > 0,
        hasPersonalDiscovery: !!user.personalDiscovery,
        hasCv: user.cvs.length > 0,
        hasScholarshipAssessment: !!user.scholarshipAssessment,
      },
    });
  } catch (error: any) {
    return handleApiError(error);
  }
}
