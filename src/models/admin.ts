import mongoose, { Schema, Document } from 'mongoose';

export type Role = 'admin' | 'scanner';

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: Role;
}

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'scanner'],
  },
});

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;