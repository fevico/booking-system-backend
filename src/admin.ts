import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/admin';

dotenv.config();

async function seedAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    const admins = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'scanner', password: 'scanner123', role: 'scanner' },
    ];

    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await Admin.findOneAndUpdate(
        { username: admin.username },
        { ...admin, password: hashedPassword },
        { upsert: true }   
      );
    }

    console.log('Admins seeded');
    process.exit(0);   
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } 
}

seedAdmins();