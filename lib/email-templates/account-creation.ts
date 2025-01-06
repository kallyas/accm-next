export function getAccountCreationEmailTemplate({
    userName,
    loginUrl,
  }: {
    userName: string | undefined;
    loginUrl: string;
  }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to African Centre For Career Mentorship</title>
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
                      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">Welcome to African Centre For Career Mentorship!</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Hello ${userName},
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We're thrilled to have you join African Centre For Career Mentorship! Your account has been successfully created, and you're now part of our community dedicated to career growth and mentorship.
                      </p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        To get started, click the button below to log in to your account:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="${loginUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #3b82f6, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Log In to Your Account</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 32px 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Here are a few things you can do to get started:
                      </p>
                      <ul style="margin: 0 0 32px 0; padding-left: 24px; font-size: 16px; line-height: 24px; color: #4b5563;">
                        <li>Complete your profile</li>
                        <li>Explore available mentorship programs</li>
                        <li>Browse upcoming events and workshops</li>
                        <li>Connect with mentors in your field</li>
                      </ul>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        If you have any questions or need assistance, don't hesitate to reach out to our support team at admin@africanccm.com.
                      </p>
                      <p style="margin: 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We're excited to be part of your career journey!
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
  
  