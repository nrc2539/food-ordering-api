import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { TableSessionStatus } from '../table.enum';

@Entity('table_sessions')
export class TableSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @Column({ name: 'qr_code' })
  qrCode: string;

  @Column({ type: 'enum', enum: TableSessionStatus })
  status: TableSessionStatus;

  @Column({
    name: 'started_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startedAt: Date;

  @Column({
    name: 'ended_at',
    type: 'timestamp',
    nullable: true,
  })
  endedAt: Date | null;
}
