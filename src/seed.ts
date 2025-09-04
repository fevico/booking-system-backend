import mongoose from 'mongoose';
import { seedPins } from './utils/pinSeeder';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI)
  .then(async () => {
    await seedPins(100); // Seed 100 pins
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
