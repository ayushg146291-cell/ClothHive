import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalRevenueResult, totalOrders, totalCustomers, totalProducts] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count(),
    ]);

    // Format revenue (it's a Decimal from Prisma)
    const revenue = totalRevenueResult._sum.totalAmount
      ? Number(totalRevenueResult._sum.totalAmount)
      : 0;

    return {
      revenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    };
  }
}
