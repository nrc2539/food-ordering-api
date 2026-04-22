import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { AccessControlModule } from 'src/access-control/access-control.module';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuCategory, MenuItem]),
    AuthModule,
    AccessControlModule,
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
