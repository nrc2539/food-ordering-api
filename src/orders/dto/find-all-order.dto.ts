import { IsOptional } from 'class-validator';

export class FindAllOrderDto {
  @IsOptional()
  sessionToken?: string;
}
