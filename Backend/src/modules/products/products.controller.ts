import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateProductsDto } from './dto/create-product.dto';
import { UpdateProductsDto } from './dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @Post('seeder')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  seeder() {
    return this.productsService.seeder();
  }

  @ApiBearerAuth()
  @Post('newproduct')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  createProduct(@Body() productDTO: CreateProductsDto) {
    return this.productsService.createProduct(productDTO);
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productDTO: UpdateProductsDto,
  ) {
    return this.productsService.updateProduct(id, productDTO);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
