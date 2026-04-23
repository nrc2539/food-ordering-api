import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';

import { OrderStatus } from '../order.enum';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}
