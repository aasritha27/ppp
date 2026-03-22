import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import complaintsRouter from './routes/complaints.js';
import otpRouter from './routes/otp.js';
import { initializeDB } from './db/schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database
initializeDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/otp', otpRouter);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Police Portal API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
