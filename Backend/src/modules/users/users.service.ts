import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/user-update.dto';
import * as bcrypt from 'bcrypt';
import { userType } from './user-type.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAllPage(page: number, limit: number) {
    return await this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        orders: {
          id: true,
          date: true,
        },
      },
    });
  }
  async findAll() {
    return await this.usersRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        orders: {
          id: true,
          date: true,
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        orders: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        address: true,
        city: true,
        userType: true,
        orders: {
          id: true,
          date: true,
        },
      },
    });

    if (!user?.orders) throw new NotFoundException('Orders not found');

    if (user.orders.length > 2) user.userType = userType.PREMIUM;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, userDTO: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    if (userDTO.password) {
      const hashedPassword = await bcrypt.hash(userDTO.password, 12);
      user.password = hashedPassword;
    }

    if (userDTO.name) user.name = userDTO.name;
    if (userDTO.email) user.email = userDTO.email;
    if (userDTO.address) user.address = userDTO.address;
    if (userDTO.phone) user.phone = userDTO.phone;

    await this.usersRepository.save(user);

    return {
      message: 'User updated successfully',
    };
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.delete(id);

    return { message: 'User deleted successfully' };
  }

  async makeAdmin(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    user.isAdmin = true;

    await this.usersRepository.save(user);

    return {
      message: 'User promoted to admin',
    };
  }
}
