import { IsDate, IsOptional } from 'class-validator';
import { OrderStatus } from '../order.enum';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';
import { Type } from 'class-transformer';

export class FindAllOrderDto extends PaginationDto {
  @IsOptional()
  sessionToken?: string;

  @IsOptional()
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endAt?: Date;
}
