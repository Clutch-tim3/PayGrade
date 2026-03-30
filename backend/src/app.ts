import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.ALLOWED_ORIGINS || 'chrome-extension://*',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.use('/v1', routes);

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Application error:', error);
  
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// 404 handler
app.use((req: any, res: any) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

export default app;