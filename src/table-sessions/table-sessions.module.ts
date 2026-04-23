import { Module } from '@nestjs/common';
import { TableSessionsService } from './table-sessions.service';
import { TableSessionsController } from './table-sessions.controller';
import { TablesModule } from 'src/tables/tables.module';
import { AuthModule } from 'src/auth/auth.module';
import { TableSession } from './entities/table-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TableSession]), TablesModule, AuthModule],
  controllers: [TableSessionsController],
  providers: [TableSessionsService],
  exports: [TableSessionsService],
})
export class TableSessionsModule {}
