import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const products = await this.prisma.product.findMany();
    
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= p.minStockLevel).length;
    const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    const recentTransactions = await this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: { product: true },
    });

    const weeklyTransactions = await this.prisma.transaction.findMany({
      where: {
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
    });

    // Group transactions by day for the last 7 days
    const dailyMovements: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayTxns = weeklyTransactions.filter(
        (t) => new Date(t.date) >= d && new Date(t.date) < nextD,
      );
      dailyMovements.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        in: dayTxns
          .filter((t) => t.type === 'IN')
          .reduce((sum, t) => sum + t.qty, 0),
        out: dayTxns
          .filter((t) => t.type === 'OUT')
          .reduce((sum, t) => sum + t.qty, 0),
      });
    }

    const transactionsToday = await this.prisma.transaction.count({
      where: {
        date: { gte: today },
      },
    });

    return {
      totalProducts,
      lowStockCount,
      totalStockValue,
      recentTransactions,
      weeklyMovements: {
        totalIn: weeklyTransactions
          .filter((t) => t.type === 'IN')
          .reduce((sum, t) => sum + t.qty, 0),
        totalOut: weeklyTransactions
          .filter((t) => t.type === 'OUT')
          .reduce((sum, t) => sum + t.qty, 0),
        daily: dailyMovements,
      },
      transactionsToday,
    };
  }
}
