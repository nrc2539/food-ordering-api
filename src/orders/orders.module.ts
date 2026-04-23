import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MenuItem } from 'src/menus/entities/menu-item.entity';
import { TableSessionsModule } from 'src/table-sessions/table-sessions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, MenuItem]),
    AuthModule,
    TableSessionsModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
