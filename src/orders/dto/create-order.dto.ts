import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsNotEmpty()
  tableSessionToken: string;

  @IsArray()
  @ValidateNested({ each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
