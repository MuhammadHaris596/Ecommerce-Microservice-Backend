import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Controller('profile')
export class ClerkController {
  @Get()
  @UseGuards(ClerkAuthGuard)
  getProfile(@Req() req ) {
    // req.user populated from Clerk token
    return { user: req.user };
  }
}
