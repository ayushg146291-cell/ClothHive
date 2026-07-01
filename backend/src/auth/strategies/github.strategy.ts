import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'placeholder',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'placeholder',
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') || 'placeholder',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    const { id, emails, displayName, username, photos } = profile;
    const email = emails?.[0]?.value || `${username}@github.local`;
    const user = await this.authService.validateOAuthUser({
      provider: 'github',
      providerId: id,
      email,
      name: displayName || username,
      avatar: photos?.[0]?.value,
    });
    done(null, user);
  }
}
