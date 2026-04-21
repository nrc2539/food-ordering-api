import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
