import { IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty()
  name: string;
}
