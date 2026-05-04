import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';

export class FindAllMenuDto extends PaginationDto {
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  isAvailable?: boolean;
}
