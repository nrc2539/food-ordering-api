import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.id)
  roleId: number;
}
