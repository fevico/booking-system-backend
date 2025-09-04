import mongoose, { Schema, Document } from 'mongoose';

export interface IPin extends Document {
  code: string;
}

const PinSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
});

export default mongoose.model<IPin>('Pin', PinSchema);
