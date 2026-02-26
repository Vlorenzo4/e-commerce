import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProductsDto {
  @ApiProperty({
    example: 'sable rojo de darth vader star wars',
    description: 'must be a valid name',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string;

  @ApiProperty({
    example:
      'sable rojo exclusivo que uso darth vader en las peliculas de star wars',
    description: 'must be a valid description',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    example: '119.99',
    description: 'must be a valid price',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    example: '5',
    description: 'must be a valid stock',
  })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
