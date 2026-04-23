import { IsNotEmpty, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  menuItemId: number;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
