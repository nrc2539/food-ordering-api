import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class FindAllUserDto {
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
