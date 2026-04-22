import { IsOptional } from 'class-validator';

export class FindAllTableSessionDto {
  @IsOptional()
  tableId?: number;

  @IsOptional()
  status?: string;
}
