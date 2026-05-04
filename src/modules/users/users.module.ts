import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Clearance } from './entities/clearance.entity';
import { Permission } from './entities/permission.entity';
import { RolesModule } from 'src/modules/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Clearance, Permission]),
    RolesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
