export function getForgotPasswordEmailTemplate({
    resetUrl,
    userName,
  }: {
    resetUrl: string;
    userName: string | undefined;
  }) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; background: linear-gradient(to right, #3b82f6, #06b6d4);">
                      <h1 style="margin: 0; font-size: 24px; color: #ffffff; text-align: center;">Pearl Mentor Hub</h1>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">Reset Your Password</h2>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        Hello${userName ? ` ${userName}` : ''},
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        We received a request to reset your password for your Pearl Mentor Hub account. If you didn't make this request, you can safely ignore this email.
                      </p>
                      <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        To reset your password, click the button below:
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center">
                            <a href="https://${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(to right, #3b82f6, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 32px 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                        If the button doesn't work, you can also copy and paste this link into your browser:
                      </p>
                      <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 22px; color: #6b7280; word-break: break-all;">
                        https://${resetUrl}
                      </p>
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 32px; border-top: 1px solid #e5e7eb;">
                        <tr>
                          <td style="padding-top: 32px;">
                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                              For security reasons, this password reset link will expire in 1 hour.
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                              If you need any assistance, please contact our support team at support@pearlmentorhub.com
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #f8fafc; text-align: center;">
                      <p style="margin: 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                        © ${new Date().getFullYear()} Pearl Mentor Hub. All rights reserved.
                      </p>
                      <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                        This email was sent to you because a password reset was requested for your account.
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
  
  