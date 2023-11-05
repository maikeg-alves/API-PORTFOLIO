import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { Unauthorized } from '../exceptions/auth.execptions';
import { ALLOW_RESTRICTED_METADATA } from '../decorators/allow-restricted.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
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

      if (payload.restricted) {
        const allowed = this.reflector.get<boolean | undefined>(
          ALLOW_RESTRICTED_METADATA,
          context.getHandler(),
        );

        if (!allowed) {
          return false;
        }
      }
      return true;
    } catch (error) {
      throw new Unauthorized();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
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
