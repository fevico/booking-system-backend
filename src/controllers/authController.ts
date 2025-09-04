import { Request, Response } from 'express';
import { generateQRCode } from '@/utils/qrcode';
import { sendEmail } from '@/utils/email';
import User from '@/models/User';
import Pin from '@/models/Pin';
import dotenv from 'dotenv';

dotenv.config();

interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    phone: string;
    pin: string;
    organization: string;
    category: 'student' | 'academia' | 'press' | 'others';
  };
}

interface VerifyRequest extends Request {
  body: { qrData: string };
}

export const register = async (req: RegisterRequest, res: Response) => {
  const { name, phone, email, pin, organization, category } = req.body;
  try {
    // Check if pin exists
    const pinDoc = await Pin.findOne({ code: pin });
    if (!pinDoc) return res.status(400).json({ message: 'Invalid or used pin.' });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already registered.' });

    // Generate QR code
    const qrCode = await generateQRCode(`User: ${email}`);

    // Create user
    const user = new User({ name, phone, email, pin, qrCode, organization, category });
    await user.save();

    // Send QR code via email
    await sendEmail({ email, qrCode, organization, category });

    // Delete pin after use
    await Pin.deleteOne({ code: pin });

    res.status(201).json({ message: 'Registration successful. QR code sent.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const verifyQR = async (req: VerifyRequest, res: Response) => {
  const { qrData } = req.body;

  try {
    const user = await User.findOne({ email: qrData.split(': ')[1] });
    if (!user) {
      return res.status(400).json({ message: 'Invalid QR' });
    }

    user.scans.push(new Date());
    await user.save();

    const message = user.scans.length > 1 ? `Welcome back, ${user.name}!` : `Welcome to the event, ${user.name}!`;
    res.json({ message, scans: user.scans.length, name: user.name, organization: user.organization });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};