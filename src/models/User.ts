import mongoose, { Schema, Document } from 'mongoose';

export type GuestCategory = 'Student' | 'Academia' | 'Press' | 'Others';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  pin: string;
  qrCode: string;
  organization?: string;
  guestCategory: GuestCategory;
  lastScan?: Date | null; // Changed from scans array to single lastScan
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  qrCode: { type: String, required: true },
  organization: { type: String },
  guestCategory: {
    type: String,
    required: true,
    enum: ['Student', 'Academia', 'Press', 'Others'],
  },
  lastScan: { type: Date, default: null }, // Single timestamp or null
});

export default mongoose.model<IUser>('User', UserSchema);