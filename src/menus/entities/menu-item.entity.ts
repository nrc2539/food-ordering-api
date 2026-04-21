import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
