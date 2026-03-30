import express from 'express';
import authController from '../controllers/auth.controller';
import salaryController from '../controllers/salary.controller';
import userController from '../controllers/user.controller';
import billingController from '../controllers/billing.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { tierGateMiddleware } from '../middleware/tierGate.middleware';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.post('/auth/magic-link', authController.createMagicLink);
router.post('/auth/verify', authController.verifyMagicLink);

// Salary routes
router.post('/salary/lookup', authMiddleware, tierGateMiddleware, salaryController.lookup);
router.post('/salary/submit', salaryController.submitSalary); // Anonymous allowed
router.post('/salary/generate-pdf', authMiddleware, tierGateMiddleware, salaryController.generatePDF);

// User routes
router.get('/user/me', authMiddleware, userController.getCurrentUser);
router.put('/user/profile', authMiddleware, userController.updateUserProfile);

// Billing routes
router.get('/billing/status', authMiddleware, billingController.getBillingStatus);
router.post('/billing/webhook', billingController.handleExtensionPayWebhook);

export default router;