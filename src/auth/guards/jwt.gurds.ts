import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Unauthorized } from '../exceptions/auth.execptions';
import { FullAccessPayload } from '../dto/jwt.dto';
import { ALLOW_RESTRICTED_METADATA } from '../decorators/allow-restricted.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new Unauthorized();
    }

    try {
      const payload = await this.authService.useAccessToken(token);

      request['user'] = payload;
    } catch {
      throw new Unauthorized();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  /*  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const rawToken: string = request.headers['authorization'];

    if (!rawToken) {
      throw new Unauthorized();
    }

    const [, parsed] = rawToken.split(' ');

    try {
      const payload: FullAccessPayload = await this.authService.useAccessToken(
        parsed,
      );

      request.payload = payload;

      if (payload.restricted) {
        const allowed = this.reflector.get<boolean | undefined>(
          ALLOW_RESTRICTED_METADATA,
          ctx.getHandler(),
        );

        if (!allowed) {
          return false;
        }
      }

      return true;
    } catch (error) {
      throw new Unauthorized();
    }
  } */
}
