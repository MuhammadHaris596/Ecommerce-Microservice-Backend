import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Param,
  Delete,
  Patch,
  Request,
  Get,
} from '@nestjs/common';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { InventoryService } from './inventory.service';
import { InventoryUploadInterceptor } from './inventoryUploader';
import { Roles } from 'apps/shared-Resources/roles.decorator';
import { Role } from 'apps/shared-Resources/schema.role';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth()
@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // HTTP GET
  @Get()
  getHello(): string {
    return this.inventoryService.getHello();
  }

  // Get products by category

  @Get('productsByCategory/:id')
  getProductByCategory(@Param('id') id: string) {
    return this.inventoryService.retrieveProductByCategory(id);
  }

  // Add product

  @Post('addProduct')
  @UseInterceptors(InventoryUploadInterceptor)
  async addProduct(
    @Body() productDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('Images are required');

    const images = files.map((file) => ({
      imageUrl: file.path,
      imageID: file.filename,
    }));
    const productData = { ...productDto, images, sellerID: req.user.userId };

    return this.inventoryService.createProduct(productData);
  }

  // Update product

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
  ) {
    dto.sellerID = req.user.userId;
    return this.inventoryService.updateProduct(id, dto);
  }

  // Update product Images
  @Post(':id/updateImages')
  @UseInterceptors(InventoryUploadInterceptor)
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    return this.inventoryService.uploadImages(id, files, req.user.userId);
  }

  @Delete(':id/images')
  async deleteImage(
    @Param('id') id: string,
    @Body('imageID') imageID: string,
    @Request() req,
  ) {
    return this.inventoryService.deleteImage(id, imageID, req.user.userId);
  }

  // Delete product
  @Roles(Role.user, Role.admin)
  @Delete('deleteProduct/:id')
  deleteProduct(@Param('id') id: string, @Request() req) {
    return this.inventoryService.removeProduct(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}
