import { Request, Response } from 'express';
import authService from '../services/auth.service';

class AuthController {
  async createMagicLink(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({
          error: 'Invalid Email',
          message: 'Please provide a valid email address',
        });
      }

      const magicLink = await authService.createMagicLink(email);

      // In a real implementation, you would send an email with the magic link
      // For this example, we'll just return the token
      const magicLinkUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${magicLink.token}`;

      res.status(200).json({
        success: true,
        message: 'Magic link created successfully',
        magic_link: magicLinkUrl,
        expires_at: magicLink.expires_at,
      });
    } catch (error) {
      console.error('Error creating magic link:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create magic link',
      });
    }
  }

  async verifyMagicLink(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: 'Missing Token',
          message: 'Token is required',
        });
      }

      const accessToken = await authService.verifyMagicLink(token);

      res.status(200).json({
        success: true,
        message: 'Token verified successfully',
        access_token: accessToken,
      });
    } catch (error: any) {
      console.error('Error verifying magic link:', error);
      
      if (error.message === 'Invalid or expired magic link') {
        res.status(400).json({
          error: 'Invalid Token',
          message: 'Magic link is invalid or expired',
        });
      } else {
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to verify magic link',
        });
      }
    }
  }
}

export default new AuthController();