import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get cart — works for both authenticated users and guests.
   * Guests must send X-Session-Id header.
   */
  @Public()
  @Get()
  async getCart(
    @Req() req: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    // Try to extract user from JWT if present (but don't require it)
    const userId = req.user?.id;
    return this.cartService.getCart(userId, sessionId);
  }

  /**
   * Add item to cart.
   */
  @Public()
  @Post('items')
  async addItem(
    @Req() req: any,
    @Headers('x-session-id') sessionId: string,
    @Body() dto: AddCartItemDto,
  ) {
    const userId = req.user?.id;
    return this.cartService.addItem(
      userId,
      sessionId,
      dto.productId,
      dto.quantity,
      dto.variantId,
    );
  }

  /**
   * Update cart item quantity.
   */
  @Public()
  @Patch('items/:id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(itemId, dto.quantity);
  }

  /**
   * Remove item from cart.
   */
  @Public()
  @Delete('items/:id')
  async removeItem(@Param('id') itemId: string) {
    return this.cartService.removeItem(itemId);
  }

  /**
   * Clear entire cart.
   */
  @Public()
  @Delete()
  async clearCart(
    @Req() req: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = req.user?.id;
    return this.cartService.clearCart(userId, sessionId);
  }

  /**
   * Merge guest cart into authenticated user's cart.
   */
  @UseGuards(JwtAuthGuard)
  @Post('merge')
  async mergeCart(
    @CurrentUser('id') userId: string,
    @Body('sessionId') sessionId: string,
  ) {
    return this.cartService.mergeCarts(userId, sessionId);
  }
}
