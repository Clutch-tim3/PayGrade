import { Request, Response } from 'express';
import prisma from '../config/database';
import billingService from '../services/billing.service';

class UserController {
  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      // Get billing status
      const billingStatus = await billingService.getBillingStatus(user.id);

       res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          lookups_this_month: user.lookups_this_month,
          lookups_limit: user.lookups_limit,
          credits_earned: user.credits_earned,
          ...billingStatus,
        },
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get user information',
      });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const updates = req.body;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updates,
      });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update user profile',
      });
    }
  }
}

export default new UserController();