import { IsOptional } from 'class-validator';

export class FindAllMenuDto {
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  isAvailable?: boolean;
}
