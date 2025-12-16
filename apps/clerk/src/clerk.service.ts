import { Injectable } from '@nestjs/common';
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  async getUser(userId: string) {
    return await clerkClient.users.getUser(userId);
  }

  async verifyAuthToken(token: string): Promise<any> {
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      return session;
    } catch (err) {
      throw new Error('Invalid token ❌');
    }
  }
}
