import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private auth0Domain: string;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const auth0Domain = configService.get<string>('AUTH0_DOMAIN');
    const auth0Audience = configService.get<string>('AUTH0_AUDIENCE');

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: auth0Audience,
      issuer: `https://${auth0Domain}/`,
      algorithms: ['RS256'],
      passReqToCallback: true, // ส่ง request มาด้วย
    });

    this.auth0Domain = auth0Domain || '';
  }

  async validate(req: any, payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    // ดึง access token จาก header
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    // ดึง profile จาก Auth0 userinfo endpoint
    let name = 'Anonymous';
    let email = `${payload.sub.replace('|', '_')}@auth0.user`;

    if (accessToken) {
      try {
        const response = await fetch(`https://${this.auth0Domain}/userinfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userInfo = await response.json();
          name = userInfo.name || userInfo.nickname || 'Anonymous';
          email = userInfo.email || email;
        }
      } catch (error) {
        console.error('Failed to fetch userinfo:', error);
      }
    }

    const user = await this.authService.validateUser(
      payload.sub,
      email,
      name,
    );

    return user;
  }
}
