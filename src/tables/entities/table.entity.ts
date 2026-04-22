import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TableSession } from './table-session.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TableSession, (session) => session.table)
  sessions: TableSession[];
}
