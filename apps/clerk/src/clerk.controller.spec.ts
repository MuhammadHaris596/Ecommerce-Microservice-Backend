import { Test, TestingModule } from '@nestjs/testing';
import { ClerkController } from './clerk.controller';
import { ClerkService } from './clerk.service';

describe('ClerkController', () => {
  let clerkController: ClerkController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ClerkController],
      providers: [ClerkService],
    }).compile();

    clerkController = app.get<ClerkController>(ClerkController);
  });
});
