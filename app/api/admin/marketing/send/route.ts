import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { Role } from "@prisma/client";

interface MarketingEmailRequest {
  subject: string;
  content: string;
  recipientType: "all" | "role" | "selected";
  targetRole?: Role;
  selectedUsers?: string[];
  sendNow: boolean;
  scheduledDate?: string;
}

// Marketing email template
function getMarketingEmailTemplate(content: string, userName?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>African Centre For Career Mentorship</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 30px 20px;
                color: #333333;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #2c3e50;
            }
            .message {
                font-size: 16px;
                line-height: 1.8;
                margin-bottom: 30px;
                white-space: pre-line;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin: 20px 0;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
            }
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-links a {
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>African Centre For Career Mentorship</h1>
                <p>Empowering Careers, Transforming Lives</p>
            </div>
            
            <div class="content">
                ${userName ? `<div class="greeting">Hello ${userName},</div>` : ''}
                
                <div class="message">${content}</div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://www.africanccm.com/dashboard" class="cta-button">
                        Visit Your Dashboard
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="#">LinkedIn</a> |
                    <a href="#">Twitter</a> |
                    <a href="#">Facebook</a>
                </div>
                
                <p>
                    <strong>African Centre For Career Mentorship</strong><br>
                    Empowering professionals across Africa through mentorship and career development.
                </p>
                
                <p>
                    <a href="https://www.africanccm.com/unsubscribe">Unsubscribe</a> |
                    <a href="https://www.africanccm.com/contact">Contact Us</a>
                </p>
                
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                    This email was sent to you because you are a member of African Centre For Career Mentorship.
                    If you received this email in error, please contact us.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body: MarketingEmailRequest = await request.json();
    const { subject, content, recipientType, targetRole, selectedUsers, sendNow, scheduledDate } = body;

    // Validate required fields
    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Get recipients based on type
    let recipients: { id: string; email: string; firstName: string; lastName: string }[] = [];

    switch (recipientType) {
      case "all":
        recipients = await db.user.findMany({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        break;

      case "role":
        if (!targetRole) {
          return NextResponse.json(
            { error: "Target role is required for role-based emails" },
            { status: 400 }
          );
        }
        recipients = await db.user.findMany({
          where: { role: targetRole },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        break;

      case "selected":
        if (!selectedUsers || selectedUsers.length === 0) {
          return NextResponse.json(
            { error: "Selected users are required for targeted emails" },
            { status: 400 }
          );
        }
        recipients = await db.user.findMany({
          where: {
            id: {
              in: selectedUsers,
            },
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid recipient type" },
          { status: 400 }
        );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found" },
        { status: 400 }
      );
    }

    // Create campaign record
    const campaign = await db.marketingCampaign.create({
      data: {
        subject,
        content,
        recipientType,
        targetRole,
        selectedUserIds: selectedUsers || [],
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        status: sendNow ? "SENDING" : "SCHEDULED",
        totalRecipients: recipients.length,
        createdBy: session.user.id,
      },
    });

    // If sending now, send emails immediately
    if (sendNow) {
      const sendPromises = recipients.map(async (recipient) => {
        try {
          const htmlContent = getMarketingEmailTemplate(
            content,
            `${recipient.firstName} ${recipient.lastName}`
          );

          await sendEmail({
            to: recipient.email,
            subject,
            text: content,
            html: htmlContent,
          });

          // Record successful send
          await db.emailLog.create({
            data: {
              campaignId: campaign.id,
              recipientId: recipient.id,
              email: recipient.email,
              status: "SENT",
              sentAt: new Date(),
            },
          });

          return { success: true, email: recipient.email };
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          
          // Record failed send
          await db.emailLog.create({
            data: {
              campaignId: campaign.id,
              recipientId: recipient.id,
              email: recipient.email,
              status: "FAILED",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          });

          return { success: false, email: recipient.email, error };
        }
      });

      const results = await Promise.allSettled(sendPromises);
      const successCount = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      // Update campaign status
      await db.marketingCampaign.update({
        where: { id: campaign.id },
        data: {
          status: "COMPLETED",
          sentCount: successCount,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        campaignId: campaign.id,
        sentTo: successCount,
        totalRecipients: recipients.length,
        message: `Marketing email sent successfully to ${successCount} out of ${recipients.length} recipients.`,
      });
    } else {
      // For scheduled emails, we'll need a background job or cron
      return NextResponse.json({
        success: true,
        campaignId: campaign.id,
        scheduledFor: scheduledDate,
        totalRecipients: recipients.length,
        message: `Marketing email scheduled for ${new Date(scheduledDate!).toLocaleString()}.`,
      });
    }
  } catch (error) {
    console.error("Marketing email error:", error);
    return NextResponse.json(
      {
        error: "Failed to send marketing email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

