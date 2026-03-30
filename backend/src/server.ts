import dotenv from 'dotenv';
import app from './app';
import prisma from './config/database';
import redis from './config/redis';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Check database connection
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');

    // Check Redis connection
    await redis.ping();
    console.log('Connected to Redis');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 PayGrade API server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/v1/health`);
      console.log(`🏢 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    
    // Cleanup and exit
    await prisma.$disconnect();
    await redis.quit();
    process.exit(1);
  }
};

// Handle shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Closing server...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal. Closing server...');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

// Start the server
startServer();