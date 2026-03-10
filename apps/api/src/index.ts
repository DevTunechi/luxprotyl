import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router } from './routes';
import { startCronJobs } from './jobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ── Routes
app.use('/api/v1', router);

// ── Health check
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'LuxProptyl API' }));

// ── Start server
app.listen(PORT, () => {
  console.log(`🚀 LuxProptyl API running on http://localhost:${PORT}`);
  startCronJobs();
});

export default app;
