import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  try {
    const data = await resend.emails.send({
      from: 'African Centre For Career Mentorship <noreply@africanccm.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

