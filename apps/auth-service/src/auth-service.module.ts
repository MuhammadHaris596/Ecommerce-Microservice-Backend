import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User,UserSchema } from './Schema/schema.auth';
import { ConfigModule } from '@nestjs/config';
import { JwtModule} from '@nestjs/jwt';


@Module({
  imports: [
       ConfigModule.forRoot(),
       
       JwtModule.register({
       global: true,
       secret: process.env.JWT_SECRET ,
       signOptions: { expiresIn: '1h' },
      }), 

        MongooseModule.forRoot(process.env.Auth_MONGODB_URL as string),

         MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  
       ],
  
    controllers: [AuthServiceController],
  
    providers: [AuthService],
  
})
export class AuthServiceModule {}



