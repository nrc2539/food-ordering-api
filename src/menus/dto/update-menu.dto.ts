import { IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  isAvailable?: boolean;
}
