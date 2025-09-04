import mongoose, { Schema, Document } from 'mongoose';


export type GuestCategory = 'student' | 'academia' | 'press' | 'creative/influencer' | 'others';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  pin: string;
  qrCode: string;
  organization?: string;
  category: GuestCategory;
  scans: Date[];
}


const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  qrCode: { type: String, required: true },
  organization: { type: String },
  scans: [{ type: Date }],
  category: {
    type: String,
    required: true,
    enum: ['student', 'academia', 'press', 'creative/influencer', 'others'],
  },
});

export default mongoose.model<IUser>('User', UserSchema);
