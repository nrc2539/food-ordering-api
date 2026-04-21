import { TableSession } from 'src/tables/entities/table-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../order.enum';
import { User } from 'src/users/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TableSession, (tableSession) => tableSession.id)
  tableSessionId: number;

  @Column()
  totalPrice: number;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  updatedBy: number; // DESC: user ID who last updated the order
}
