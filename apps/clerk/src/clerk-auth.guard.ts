// apps/auth-service/src/guards/clerk-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly clerkService: ClerkService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = await this.clerkService.verifyAuthToken(token);
      request.user = payload; // attach user info to request
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
