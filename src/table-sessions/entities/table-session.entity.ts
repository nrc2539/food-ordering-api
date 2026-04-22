import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Table } from '../../tables/entities/table.entity';
import { TableSessionStatus } from '../table-session.enum';
import { Order } from 'src/orders/entities/order.entity';

@Entity('table_sessions')
export class TableSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table, (table) => table.sessions)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @Column({ name: 'session_token', type: 'text', unique: true })
  sessionToken: string;

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

  @OneToMany(() => Order, (order) => order.tableSession)
  orders: Order[];
}
