import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Google OAuth ────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Guard redirects to Google consent screen
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  // ─── GitHub OAuth ────────────────────────────────────────

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Guard redirects to GitHub consent screen
  }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  // ─── Token Endpoints ────────────────────────────────────

  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  // ─── Protected Endpoints ─────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    // JWT is stateless — client just discards the token
    // In a full implementation, you'd add the token to a blacklist
    return { message: 'Logged out successfully' };
  }

  // ─── Helpers ─────────────────────────────────────────────

  private handleOAuthCallback(req: Request, res: Response) {
    const user = req.user as any;
    const tokens = this.authService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const rawFrontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const frontendUrl = rawFrontendUrl.replace(/\/+$/, '');
    const callbackUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

    return res.redirect(callbackUrl);
  }
}
