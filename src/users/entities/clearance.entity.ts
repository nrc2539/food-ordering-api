import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from './role.entity';

@Entity('clearances')
export class Clearance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission, (permission) => permission.id)
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.id)
  roleId: number;
}
