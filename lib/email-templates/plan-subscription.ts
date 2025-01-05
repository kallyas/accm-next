export function getPlanSubscriptionEmailTemplate({
  userName,
  planName,
  planDetails,
  startDate,
  dashboardUrl,
}: {
  userName: string | undefined;
  planName: string;
  planDetails: string[];
  startDate: string;
  dashboardUrl: string;
}) {
  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your African Centre For Career Mentorship Subscription</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; background: linear-gradient(to right, #3b82f6, #06b6d4);">
                      <h1 style="margin: 0; font-size: 24px; color: #ffffff; text-align: center;">African Centre For Career Mentorship</h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">Thank You for Your Subscription!</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Hello ${userName},
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We're excited to confirm your subscription to the <strong>${planName}</strong> plan on African Centre For Career Mentorship. Your subscription is now active, and you have access to all the features included in your plan.
                      </p>
                      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Here's a summary of your subscription:
                      </p>
                      <ul style="margin: 0 0 24px 0; padding-left: 24px; font-size: 16px; line-height: 24px; color: #4b5563;">
                        <li>Plan: ${planName}</li>
                        <li>Start Date: ${startDate}</li>
                        ${planDetails
                          .map((detail) => `<li>${detail}</li>`)
                          .join("")}
                      </ul>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        To access your account and start exploring your new features, click the button below:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${dashboardUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #3b82f6, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to My Dashboard</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        If you have any questions about your subscription or need assistance, please don't hesitate to contact our support team at admin@africanccm.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #f8fafc; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                        © ${new Date().getFullYear()} African Centre For Career Mentorship. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
}
