import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateProductDto } from '../DTO/dto.order';
import { AuthGuard } from 'apps/shared-Resources/auth-service.guard';
import { RolesGuard } from 'apps/shared-Resources/roles.guard';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth()
@ApiTags('order')
@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('getUserOrder')
  async getorder(@Req() req) {
    const buyerID = req.user.userId;
    return this.orderService.retrieveOrder(buyerID);
  }

  @Post('createOrder')
  async addOrder(@Body() dto: CreateProductDto) {
    const orderData = await this.orderService.createOrder(dto);
    return orderData;
  }

  //  @Delete('deleteOrder/:id')
  //  async deleteCart (@Param('id')  id :string){

  //   return await this.orderService.removeOrder(id)
  //  }
}
