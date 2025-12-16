import {
  Injectable,
  BadRequestException,
  ConflictException,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from '../DTO/registerUser_login.Dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Schema/schema.auth';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(id: string) {
    if (!id) throw new BadRequestException('User id is required');

    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User did not exist');

    return {
      id: user._id.toString(),
    };
  }

  async registerUser(registerDto: RegisterDto) {
    const existUser = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (existUser) {
      throw new ConflictException('Email already  exists');
    }

    const createUser = new this.userModel(registerDto);
    return await createUser.save();
  }

  async loginUser(loginUserDto: LoginDto) {
    let userExist = await this.userModel.findOne({ email: loginUserDto.email });

    if (!userExist) {
      throw new BadRequestException('Invalid email address !');
    }

    let matchPassword = await bcrypt.compare(
      loginUserDto.password,
      userExist.password,
    );

    if (!matchPassword) {
      throw new BadRequestException('Invalid password !');
    }

    const payload = {
      userId: userExist._id,
      role: userExist.role,
      name: userExist.name,
      username: userExist.username,
    };

    const tokenData = this.jwtService.sign(payload, { expiresIn: '1h' });

    return tokenData;
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    const resetToken = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // TODO: send email here
    console.log('RESET OTP:', resetToken);

    return { message: 'OTP sent to registered email 📩' };
  }

  async verifyResetCode(code: string) {
    const user = await this.userModel.findOne({
      resetToken: code,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) throw new BadRequestException('Invalid or expired code ❌');

    return { valid: true, message: 'Code verified ✅' };
  }

  async resetPassword(code: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetToken: code,
    });

    if (user) {
      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
    }

    return { message: 'Password Reset Successful!' };
  }

  async getUserById(userId: string) {
    return await this.userModel.findById(userId).select('-password');
  }
}
