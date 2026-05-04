import { IsNotEmpty } from 'class-validator';
import { TableSessionStatus } from '../table-session.enum';

export class UpdateTableSessionDto {
  @IsNotEmpty()
  status: TableSessionStatus;
}
