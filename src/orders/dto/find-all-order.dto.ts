import { IsOptional } from 'class-validator';
import { OrderStatus } from '../order.enum';

export class FindAllOrderDto {
  @IsOptional()
  sessionToken?: string;

  @IsOptional()
  status?: OrderStatus;

  @IsOptional()
  startAt?: string; // ISO Date string

  @IsOptional()
  endAt?: string; // ISO Date string
}
