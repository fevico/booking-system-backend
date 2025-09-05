

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/authRoutes';

dotenv.config();


const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002', // Allow Next.js frontend
  methods: ['GET', 'POST'],
  credentials: true,
}))

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 
 

  app.use("/api", router);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from Express + TypeScript + MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
