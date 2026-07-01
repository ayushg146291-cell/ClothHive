import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create a cart for a user or guest session.
   */
  async getCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException('Either userId or sessionId must be provided');
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await this.prisma.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              include: { variants: true },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: userId ? { userId } : { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: { variants: true },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add an item to the cart. If the same product+variant already exists, increment quantity.
   */
  async addItem(
    userId: string | undefined,
    sessionId: string | undefined,
    productId: string,
    quantity: number,
    variantId?: string,
  ) {
    // Validate product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or unavailable');
    }

    // Validate variant if provided
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) throw new NotFoundException('Variant not found');
      if (variant.stock < quantity) throw new BadRequestException('Insufficient variant stock');
    } else {
      if (product.stock < quantity) throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    const cart = await this.getCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.variantId === (variantId || null),
    );

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: { include: { variants: true } } },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
      include: { product: { include: { variants: true } } },
    });
  }

  /**
   * Update the quantity of a cart item.
   */
  async updateItemQuantity(itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: { include: { variants: true } } },
    });

    if (!item) throw new NotFoundException('Cart item not found');

    // Validate stock
    if (item.variantId) {
      const variant = item.product.variants.find((v) => v.id === item.variantId);
      if (variant && variant.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    } else {
      if (item.product.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: { include: { variants: true } } },
    });
  }

  /**
   * Remove a single item from the cart.
   */
  async removeItem(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed' };
  }

  /**
   * Clear all items from a cart.
   */
  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { message: 'Cart cleared' };
  }

  /**
   * Merge guest cart into user cart on login.
   */
  async mergeCarts(userId: string, sessionId: string) {
    const sessionCart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!sessionCart || sessionCart.items.length === 0) return this.getCart(userId);

    const userCart = await this.getCart(userId);

    for (const item of sessionCart.items) {
      const existing = userCart.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
      );
      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.update({
          where: { id: item.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete empty guest cart
    await this.prisma.cart.delete({ where: { id: sessionCart.id } });

    return this.getCart(userId);
  }
}
