import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/utils/pagination/dto/pagination.dto';

export class FindAllUserDto extends PaginationDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }: { value: string | string[] }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v)).filter((v) => !isNaN(v));
    }
    if (typeof value === 'string') {
      const transformVal = Number(value);
      return [transformVal].filter((v) => !isNaN(v));
    }
    return value;
  })
  roleIds?: number[];
}
