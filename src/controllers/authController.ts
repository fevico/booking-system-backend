import { Request, Response } from 'express';
import { Parser } from 'json2csv';
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
    category: 'Student' | 'Academia' | 'Press' | 'Others';
  };
}

interface VerifyRequest extends Request {
  body: { qrData: string };
}

export const register = async (req: RegisterRequest, res: Response) => {
  const { name, phone, email, pin, organization, category } = req.body;
  try {
    const pinDoc = await Pin.findOne({ code: pin });
    if (!pinDoc) return res.status(400).json({ message: 'Invalid or used pin.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already registered.' });

    const qrCode = await generateQRCode(`User: ${email}`);

    const user = new User({ name, phone, email, pin, qrCode, organization, guestCategory: category });
    await user.save();

    await sendEmail({ email, qrCode, organization, category });

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

    user.lastScan = new Date(); // Update lastScan with current timestamp
    await user.save();

    const message = user.lastScan ? `Welcome${user.lastScan.getTime() === new Date().getTime() ? ' to the event' : ' back'}, ${user.name}!` : `Welcome to the event, ${user.name}!`;
    res.json({ message, lastScan: user.lastScan, name: user.name, organization: user.organization });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAttendees = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const attendees = await User.find({ lastScan: { $ne: null } }).skip(skip).limit(limit); // Updated to check lastScan
    const total = await User.countDocuments({ lastScan: { $ne: null } });

    res.json({
      attendees,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAttendees: total,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const exportPins = async (req: Request, res: Response) => {
  try {
    const pins = await Pin.find({}, { code: 1, _id: 0 });
    const pinList = pins.map(p => ({ pin: p.code }));

    const fields = ['pin'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(pinList);

    res.header('Content-Type', 'text/csv');
    res.attachment('pins.csv');
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};