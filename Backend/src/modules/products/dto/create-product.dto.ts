import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductsDto {
  @ApiProperty({
    example: 'Sable star wars',
    description: 'must be a valid name',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty({
    example: 'Sable de darth vader star wars',
    description: 'must be a valid description',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  description: string;

  @ApiProperty({
    example: '99.99',
    description: 'must be a valid price',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '10',
    description: 'must be a valid stock',
  })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @ApiProperty({
    example:
      'https://http2.mlstatic.com/D_Q_NP_2X_665171-MLA89162599483_082025-T.webp',
    description: 'must be a valid description',
  })
  @IsNotEmpty()
  @IsUrl()
  imgUrl: string;

  @ApiProperty({
    example: 'must be a valid categoryId',
    description: 'must be a valid categoryId',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
