import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Table } from './table.entity';
import { TableSessionStatus } from '../table.enum';

@Entity('table_sessions')
export class TableSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table, (table) => table.id)
  tableId: number;

  @Column()
  qrCode: string;

  @Column({ type: 'enum', enum: TableSessionStatus })
  status: TableSessionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;
}
