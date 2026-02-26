import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Coleccionables',
    description: 'must be a valid name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
