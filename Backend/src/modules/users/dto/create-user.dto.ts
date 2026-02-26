import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'valen@gmail.com',
    description: 'must be a valid password',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'valentin',
    description: 'must be a valid name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre solo puede contener letras, acentos y espacios',
  })
  name: string;

  @ApiProperty({
    example: 'Valen123!',
    description: 'must be a valid email',
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  password: string;

  @ApiProperty({
    example: 'Av.corrientes 1234',
    description: 'must be a valid address',
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  address: string;

  @ApiProperty({
    example: '1138840027',
    description: 'must be a valid phone',
  })
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @ApiProperty({
    example: 'Argentina',
    description: 'must be a valid contry',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(80)
  country: string;

  @ApiProperty({
    example: 'Capital federal',
    description: 'city',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  city: string;
}

export class LoginDTO extends PickType(CreateUserDto, ['email', 'password']) {}
