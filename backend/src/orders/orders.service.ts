import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Prisma } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Fetch user cart & address
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: { include: { variants: true } } },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const address = await tx.address.create({
        data: {
          userId,
          ...dto.shippingAddress,
        },
      });

      // 2. Validate stock and calculate totals
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        const product = item.product;
        
        let unitPrice = Number(product.price);
        let variantStock = product.stock;
        
        if (item.variantId) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (!variant) throw new NotFoundException(`Variant not found for product ${product.id}`);
          if (variant.price) unitPrice = Number(variant.price);
          variantStock = variant.stock;
        }

        if (variantStock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItemsData.push({
          productId: product.id,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          productSnapshot: product as any, // Store snapshot
        });
        
        // Decrement stock
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } }
          });
        } else {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      const taxRate = 0.08; // 8% tax (example)
      const tax = subtotal * taxRate;
      const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const totalAmount = subtotal + tax + shippingCost;

      // 3. Create the order
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          paymentMethod: 'COD',
          subtotal,
          tax,
          shippingCost,
          totalAmount,
          notes: dto.notes,
          shippingAddress: address as any,
          statusHistory: [{ status: 'PENDING', timestamp: new Date().toISOString() }],
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // 4. Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    // 5. Send confirmation email (outside transaction)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      this.emailService.sendOrderConfirmation(result, user);
    }

    return result;
  }

  async getMyOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { items: true },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // --- Admin Methods ---

  async getAllOrders(page = 1, limit = 10, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};
    
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderByIdAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { id: true, name: true, email: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const historyEntry = {
      status: dto.status,
      timestamp: new Date().toISOString(),
      note: dto.note,
    };

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        trackingNumber: dto.trackingNumber !== undefined ? dto.trackingNumber : undefined,
        trackingUrl: dto.trackingUrl !== undefined ? dto.trackingUrl : undefined,
        estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : undefined,
        statusHistory: {
          push: historyEntry,
        },
      },
      include: { user: true },
    });

    if (updatedOrder.status !== order.status) {
      this.emailService.sendOrderStatusUpdate(updatedOrder, updatedOrder.user, updatedOrder.status);
    }

    return updatedOrder;
  }
}
