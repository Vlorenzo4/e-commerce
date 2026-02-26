import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @Post('seeder')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  seeder() {
    return this.categoriesService.seeder();
  }

  @ApiBearerAuth()
  @Post('newcategorie')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  createCategorie(@Body() categoryDTO: CreateCategoryDto) {
    return this.categoriesService.create(categoryDTO);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOneById(id);
  }

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  findAllCategories() {
    return this.categoriesService.findAll();
  }
}
