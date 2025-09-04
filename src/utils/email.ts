import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

interface EmailData {
  email: string;
  qrCode: string;
  organization: string;
  category: string;
}

export const sendEmail = async ({ email, qrCode, organization, category }: EmailData) => {
  try {
    // Extract base64 data from data URL (e.g., "data:image/png;base64,...")
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
    const qrCodeBuffer = Buffer.from(base64Data, 'base64');

    const htmlContent = `
      <h1>Welcome to Our Event</h1>
      <p>Your QR code is attached below for event access.</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Category:</strong> ${category}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [email],
      subject: 'Your Event QR Code',
      html: htmlContent,
      attachments: [
        {
          filename: 'qr-code.png',
          content: qrCodeBuffer,
          contentType: 'image/png',
        },
      ],
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    console.log(`Email sent to ${email}:`, data);
    return data;
  } catch (err: any) {
    console.error('Error in sendEmail:', err.message);
    throw err;
  }
};