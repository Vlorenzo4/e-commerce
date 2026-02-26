import { ArrayMinSize, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ArrayMinSize(1)
  products: {
    id: string;
  }[];
}
