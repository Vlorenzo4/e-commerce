import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDTO } from '../users/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(user: CreateUserDto) {
    const findUser = await this.usersRepository.findOneBy({
      email: user.email,
    });

    if (findUser) throw new BadRequestException('User already registered');

    const hashedPassword = await bcrypt.hash(user.password, 12);

    try {
      const newUser: Users = this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });
      const userResponse = await this.usersRepository.save(newUser);

      return {
        id: userResponse.id,
        name: userResponse.name,
        email: userResponse.email,
      };
    } catch {
      throw new BadRequestException('User could not be created');
    }
  }

  async signIn(credentials: LoginDTO) {
    const findUser = await this.usersRepository.findOneBy({
      email: credentials.email,
    });

    if (!findUser) throw new BadRequestException('bad credentials');

    const matchPassword = await bcrypt.compare(
      credentials.password,
      findUser.password,
    );

    if (!matchPassword) throw new BadRequestException('bad credentials');

    const payload = {
      id: findUser.id,
      email: findUser.email,
      isAdmin: findUser.isAdmin,
    };

    const token = this.jwtService.sign(payload);

    return { login: true, access_token: token };
  }
}
