import { Module } from '@nestjs/common';
import { TableSessionsService } from './table-sessions.service';
import { TableSessionsController } from './table-sessions.controller';
import { TablesModule } from 'src/modules/tables/tables.module';
import { TableSession } from './entities/table-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TableSession]), TablesModule, AuthModule],
  controllers: [TableSessionsController],
  providers: [TableSessionsService],
  exports: [TableSessionsService],
})
export class TableSessionsModule {}
