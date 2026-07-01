import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface OAuthProfile {
  provider: string;
  providerId: string;
  email: string;
  name?: string;
  avatar?: string;
}

import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Find or create user from OAuth profile.
   * If the user already exists (same provider+providerId), update their info.
   * If a user with the same email exists from a different provider, link them.
   */
  async validateOAuthUser(profile: OAuthProfile) {
    const { provider, providerId, email, name, avatar } = profile;

    // Try to find by provider + providerId first
    let user = await this.prisma.user.findUnique({
      where: {
        provider_providerId: { provider, providerId },
      },
    });

    if (user) {
      // Update profile info on each login
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { name: name || user.name, avatar: avatar || user.avatar },
      });
      this.logger.log(`Existing user logged in: ${user.email} via ${provider}`);
      return user;
    }

    // Check if user exists with same email (different provider)
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      // Update to current provider (account linking)
      user = await this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: { provider, providerId, avatar: avatar || existingByEmail.avatar },
      });
      this.logger.log(`Linked ${provider} to existing user: ${email}`);
      return user;
    }

    // Create new user
    user = await this.prisma.user.create({
      data: {
        email,
        name,
        avatar,
        provider,
        providerId,
        role: 'CUSTOMER',
      },
    });
    this.logger.log(`New user created: ${email} via ${provider}`);
    
    // Send welcome email
    this.emailService.sendWelcomeEmail(user);
    
    return user;
  }

  /**
   * Generate access and refresh tokens for a user.
   */
  generateTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'defaultSecret',
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '7d',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'defaultSecret',
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d',
    } as any);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh an expired access token using a refresh token.
   */
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or deactivated');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Get current user profile with addresses.
   */
  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
      },
    });
  }
}
