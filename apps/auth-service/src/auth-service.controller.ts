import { Controller, Post, Body, Res,UseGuards , Get , Request } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { LoginDto, RegisterDto } from '../DTO/registerUser.Dto';
import { ApiBasicAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../shared-Resources/auth-service.guard';
import { Roles } from '../../shared-Resources/roles.decorator';
import { Role } from '../../shared-Resources/schema.role';
import { RolesGuard } from '../../shared-Resources/roles.guard';

@ApiBasicAuth()
@Controller('auth')
export class AuthServiceController {
  constructor(private readonly AuthService: AuthService) {}

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
    message: "Login Successful!",
    token
  });
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.AuthService.forgotPassword(email);
  }

  @Post("verify-reset-code")
  async verifyResetCode( @Body("code") code: string ) {
    return this.AuthService.verifyResetCode(code);
  }

  @Post('reset-password')
  async resetPassword( @Body() body ) {
    const { token, newPassword } = body;
    return await this.AuthService.resetPassword(token, newPassword);
  }


   @Roles(Role.user)
   @UseGuards(AuthGuard,RolesGuard)
   
    @Get('profile')
        async getprofile(@Request() req){
            const userID = req.user.userId
        return await this.AuthService.getUserById(userID)
    }
    
}
