import { Request, Response } from 'express';
import billingService from '../services/billing.service';

class BillingController {
  async getBillingStatus(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const status = await billingService.getBillingStatus(user.id);

      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      console.error('Error getting billing status:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to get billing status',
      });
    }
  }

  async handleExtensionPayWebhook(req: Request, res: Response) {
    try {
      // ExtensionPay webhook verification would happen here
      // For now, we'll just parse the request
      
      const { userId, subscriptionId, status, plan } = req.body;

      if (status === 'active') {
        const tier = plan.toLowerCase().includes('pro') ? 'pro' : 'free';
        await billingService.updateSubscriptionStatus(userId, subscriptionId, tier);
      } else if (status === 'cancelled') {
        await billingService.updateSubscriptionStatus(userId, subscriptionId, 'free');
      }

      res.status(200).json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('Error handling billing webhook:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process billing webhook',
      });
    }
  }
}

export default new BillingController();