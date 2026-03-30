import { Request, Response, NextFunction } from 'express';
import billingService from '../services/billing.service';

export const tierGateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Check quota for free users
    const quota = await billingService.checkQuota(user.id);
    
    if (quota.remaining <= 0) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'You have exceeded your monthly lookup limit. Upgrade to Pro for unlimited lookups.',
        limit: quota.limit,
        used: quota.used,
      });
    }

    // Increment lookup count
    const success = await billingService.incrementLookupCount(user.id);
    
    if (!success) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'You have exceeded your monthly lookup limit',
        limit: quota.limit,
        used: quota.used,
      });
    }

    next();
  } catch (error) {
    console.error('Tier gate error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check user quota',
    });
  }
};