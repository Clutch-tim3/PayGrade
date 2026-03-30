import prisma from '../config/database';

class BillingService {
  async updateSubscriptionStatus(userId: string, extensionpayId: string, tier: 'free' | 'pro') {
    return prisma.user.update({
      where: { id: userId },
      data: {
        tier,
        extensionpay_id: extensionpayId,
      },
    });
  }

  async checkQuota(userId: string): Promise<{ remaining: number; limit: number; used: number }> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Pro users have unlimited lookups
    if (user.tier === 'pro') {
      return {
        remaining: Infinity,
        limit: Infinity,
        used: 0,
      };
    }

    // Free users get 10 lookups per month
    const remaining = user.lookups_limit - user.lookups_this_month;
    
    return {
      remaining: Math.max(0, remaining),
      limit: user.lookups_limit,
      used: user.lookups_this_month,
    };
  }

  async incrementLookupCount(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Pro users have unlimited lookups
    if (user.tier === 'pro') {
      return true;
    }

    // Check if user has remaining lookups
    if (user.lookups_this_month >= user.lookups_limit) {
      return false;
    }

    // Increment lookup count
    await prisma.user.update({
      where: { id: userId },
      data: {
        lookups_this_month: user.lookups_this_month + 1,
      },
    });

    return true;
  }

  async applyCredit(userId: string, credits: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Each credit gives 1 lookup
    return prisma.user.update({
      where: { id: userId },
      data: {
        lookups_limit: user.lookups_limit + credits,
      },
    });
  }

  async getBillingStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      tier: user.tier,
      credits: user.credits_earned,
      lookupsThisMonth: user.lookups_this_month,
      lookupsLimit: user.lookups_limit,
    };
  }
}

export default new BillingService();