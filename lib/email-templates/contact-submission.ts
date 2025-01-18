export function getContactFormEmailTemplate({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission - African Centre For Career Mentorship</title>
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
                        <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">New Contact Form Submission</h2>
                        
                        <div style="margin: 0 0 32px 0; padding: 24px; background-color: #f8fafc; border-radius: 6px;">
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                <strong style="color: #4b5563;">From:</strong>
                                <span style="color: #111827;">${name}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                <strong style="color: #4b5563;">Email:</strong>
                                <span style="color: #111827;">${email}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                <strong style="color: #4b5563;">Subject:</strong>
                                <span style="color: #111827;">${subject}</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;">
                                <strong style="color: #4b5563;">Message:</strong>
                                <p style="margin: 8px 0 0 0; color: #111827; white-space: pre-wrap;">${message}</p>
                              </td>
                            </tr>
                          </table>
                        </div>
  
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                          This message was sent through the contact form on the African Centre For Career Mentorship website.
                        </p>
  
                        <p style="margin: 0; font-size: 14px; line-height: 22px; color: #6b7280;">
                          Please respond to this inquiry within 24 hours to maintain our communication standards.
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
