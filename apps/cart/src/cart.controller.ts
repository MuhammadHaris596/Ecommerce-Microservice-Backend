import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from '../DTO/createCart.dto';
import { AuthGuard } from 'apps/shared-Resources/auth-service.guard';
import { RolesGuard } from 'apps/shared-Resources/roles.guard';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth() @ApiTags('cart')
@UseGuards(AuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  
  @Get('getUserCart')
  async getUserCart(@Req() req) {
    const buyerID = req.user.userId;
    return this.cartService.getUserCart(buyerID);
  }

  @Post('addToCart')
  async addToCart(
    @Body() createDto: CreateCartDto,
    @Req() req
  ) {
    return this.cartService.createCart(createDto, req.user.userId);
  }

  @Delete('deleteproduct/:id')
  async deleteCartProduct(@Param('id') id: string) {
    return this.cartService.removeCart(id);
  }
}
