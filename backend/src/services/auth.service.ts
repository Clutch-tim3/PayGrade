import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'paygrade-secret-key';
const JWT_EXPIRES_IN = '7d';
const MAGIC_LINK_EXPIRES_IN = 3600; // 1 hour in seconds

interface MagicLinkData {
  email: string;
  token: string;
  expires_at: Date;
}

class AuthService {
  async createMagicLink(email: string): Promise<MagicLinkData> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRES_IN * 1000);

    // Create or update user
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    // Create magic link
    await prisma.magicLink.create({
      data: {
        email,
        token,
        expires_at: expiresAt,
      },
    });

    return {
      email,
      token,
      expires_at: expiresAt,
    };
  }

  async verifyMagicLink(token: string): Promise<string> {
    const magicLink = await prisma.magicLink.findFirst({
      where: {
        token,
        used: false,
        expires_at: { gte: new Date() },
      },
    });

    if (!magicLink) {
      throw new Error('Invalid or expired magic link');
    }

    // Mark as used
    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: magicLink.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: magicLink.email,
        },
      });
    }

    // Generate JWT
    return this.generateToken(user.id);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export default new AuthService();