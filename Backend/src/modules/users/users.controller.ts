import {
  Controller,
  Body,
  Get,
  Query,
  ParseUUIDPipe,
  Param,
  UseGuards,
  Put,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/roles.enum';
import { UpdateUserDto } from './dto/user-update.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    if (!page && !limit) {
      return this.usersService.findAll();
    }

    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 3;

    return this.usersService.findAllPage(pageNumber, limitNumber);
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userDTO: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, userDTO);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @ApiBearerAuth()
  @Patch(':id/admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.makeAdmin(id);
  }
}
