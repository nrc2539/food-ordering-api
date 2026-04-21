import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id)
  orderId: number;

  @Column()
  menuItemId: number; // Assuming you have a MenuItem entity with an ID

  @Column()
  quantity: number;

  @Column()
  price: number;
}
