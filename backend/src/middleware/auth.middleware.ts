import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No bearer token provided',
      });
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const decoded = await authService.validateToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token',
      });
    }

    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    // Attach user to request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
    });
  }
};