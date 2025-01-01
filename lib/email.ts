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
      from: 'Pearl Mentor Hub <noreply@pearlmentorhub.com>',
      to,
      subject,
      text,
      html: html || text,
    });

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

