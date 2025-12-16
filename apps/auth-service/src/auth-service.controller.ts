import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth-service.service';
import {LoginDto} from "./dto/login-user.dto"
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import {RegisterDto} from "./dto/register-user.dto"
import { AuthGuard } from '../../shared-Resources/auth-service.guard';
import { Roles } from 'apps/shared-Resources/roles.decorator';
import { Role } from 'apps/shared-Resources/schema.role';
import { RolesGuard } from 'apps/shared-Resources/roles.guard';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@ApiBasicAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly AuthService: AuthService) {}

  @GrpcMethod('UserService', 'UserExist')
  async findOne(data: { id: string }) {
    if (!data.id) throw new RpcException('User ID is required');
    try {
      return await this.AuthService.getUser(data.id);
    } catch (err) {
      console.error('Error in gRPC method:', err);
      throw err;
    }
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    const register = await this.AuthService.registerUser(registerDto);
    return register;
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto, @Res() res) {
    const token = await this.AuthService.loginUser(loginDto);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login Successful!',
      token,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.AuthService.forgotPassword(email);
  }

  @Post('verify-reset-code')
  async verifyResetCode(@Body('code') code: string) {
    return this.AuthService.verifyResetCode(code);
  }

  @Post('reset-password')
  async resetPassword(@Body() body) {
    const { token, newPassword } = body;
    return await this.AuthService.resetPassword(token, newPassword);
  }

  @Roles(Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('profile')
  async getprofile(@Request() req) {
    const userID = req.user.userId;
    return await this.AuthService.getUserById(userID);
  }
}
