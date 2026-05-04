import { IsNotEmpty } from 'class-validator';
import { TableSessionStatus } from '../table-session.enum';

export class CreateTableSessionDto {
  @IsNotEmpty()
  tableId: number;

  @IsNotEmpty()
  status: TableSessionStatus;
}
