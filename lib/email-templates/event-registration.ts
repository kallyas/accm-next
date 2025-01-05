export function getEventRegistrationEmailTemplate({
    userName,
    eventName,
    eventDate,
    eventTime,
    eventLocation,
    eventDescription,
    joinUrl,
  }: {
    userName: string | undefined;
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventDescription: string;
    joinUrl: string;
  }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Event Registration Confirmation</title>
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
                      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">Event Registration Confirmation</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Hello ${userName},
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Thank you for registering for the upcoming event: <strong>${eventName}</strong>. We're excited to have you join us!
                      </p>
                      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Here are the event details:
                      </p>
                      <ul style="margin: 0 0 24px 0; padding-left: 24px; font-size: 16px; line-height: 24px; color: #4b5563;">
                        <li>Date: ${eventDate}</li>
                        <li>Time: ${eventTime}</li>
                        <li>Location: ${eventLocation}</li>
                      </ul>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        <strong>Event Description:</strong><br>
                        ${eventDescription}
                      </p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        To join the event or access more information, please click the button below:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${joinUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #3b82f6, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Join Event</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        If you have any questions or need to make changes to your registration, please contact our support team at admin@africanccm.com
                      </p>
                      <p style="margin: 24px 0 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We look forward to seeing you at the event!
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
  
  