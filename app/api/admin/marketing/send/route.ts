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

// Rate limiter utility
class RateLimiter {
  private queue: (() => Promise<any>)[] = [];
  private isProcessing = false;
  private readonly rateLimit: number;
  private readonly interval: number;

  constructor(requestsPerSecond: number = 2) {
    this.rateLimit = requestsPerSecond;
    this.interval = 1000 / requestsPerSecond; // ms between requests
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        
        // Wait for the interval before processing next task
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.interval));
        }
      }
    }

    this.isProcessing = false;
  }
}

// Global rate limiter instance (1.8 requests per second to be safe)
const emailRateLimiter = new RateLimiter(1.8);

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

// Function to send emails with rate limiting and batch processing
async function sendEmailsWithRateLimit(
  recipients: { id: string; email: string; firstName: string; lastName: string }[],
  subject: string,
  content: string,
  campaignId: string
) {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as any[]
  };

  // Process emails in batches to avoid memory issues with large lists
  const batchSize = 100;
  const batches = [];
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    batches.push(recipients.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const batchPromises = batch.map(async (recipient) => {
      return emailRateLimiter.add(async () => {
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
              campaignId: campaignId,
              recipientId: recipient.id,
              email: recipient.email,
              status: "SENT",
              sentAt: new Date(),
            },
          });

          results.sent++;
          return { success: true, email: recipient.email };
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          
          // Record failed send
          await db.emailLog.create({
            data: {
              campaignId: campaignId,
              recipientId: recipient.id,
              email: recipient.email,
              status: "FAILED",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          });

          results.failed++;
          results.errors.push({ email: recipient.email, error });
          return { success: false, email: recipient.email, error };
        }
      });
    });

    // Wait for current batch to complete before moving to next
    await Promise.allSettled(batchPromises);
    
    // Optional: Add a small delay between batches
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
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

    // If sending now, send emails with rate limiting
    if (sendNow) {
      // For large campaigns, consider processing in background
      if (recipients.length > 500) {
        // Start the sending process in background
        // You might want to use a queue system like Bull/BullMQ for production
        sendEmailsWithRateLimit(recipients, subject, content, campaign.id)
          .then(async (results) => {
            await db.marketingCampaign.update({
              where: { id: campaign.id },
              data: {
                status: "COMPLETED",
                sentCount: results.sent,
                completedAt: new Date(),
              },
            });
          })
          .catch(async (error) => {
            console.error("Background email sending failed:", error);
            await db.marketingCampaign.update({
              where: { id: campaign.id },
              data: {
                status: "FAILED",
              },
            });
          });

        return NextResponse.json({
          success: true,
          campaignId: campaign.id,
          totalRecipients: recipients.length,
          message: `Large campaign started. Sending ${recipients.length} emails in background with rate limiting.`,
          estimatedDuration: `Approximately ${Math.ceil(recipients.length / 1.8 / 60)} minutes`,
        });
      } else {
        // For smaller campaigns, send immediately with rate limiting
        const results = await sendEmailsWithRateLimit(recipients, subject, content, campaign.id);

        // Update campaign status
        await db.marketingCampaign.update({
          where: { id: campaign.id },
          data: {
            status: "COMPLETED",
            sentCount: results.sent,
            completedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          campaignId: campaign.id,
          sentTo: results.sent,
          failed: results.failed,
          totalRecipients: recipients.length,
          message: `Marketing email sent successfully to ${results.sent} out of ${recipients.length} recipients.`,
          ...(results.failed > 0 && { 
            warning: `${results.failed} emails failed to send. Check the email logs for details.` 
          }),
        });
      }
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