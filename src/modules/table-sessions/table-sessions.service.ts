import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

import { TableSession } from './entities/table-session.entity';
import { TablesService } from 'src/modules/tables/tables.service';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';
import { TableSessionStatus } from './table-session.enum';
import { FindAllTableSessionDto } from './dto/find-all-table-session.dto';

@Injectable()
export class TableSessionsService {
  constructor(
    private readonly tableService: TablesService,
    @InjectRepository(TableSession)
    private tableSessionRepository: Repository<TableSession>,
  ) {}
  async create(createTableSessionDto: CreateTableSessionDto) {
    const { tableId, status } = createTableSessionDto;
    const table = await this.tableService.findOne(tableId);
    if (status !== TableSessionStatus.ACTIVE || !table) {
      throw new BadRequestException('Cannot create session.');
    }

    const activeSession = await this.findActiveSessionByTableId(tableId);
    if (activeSession) {
      throw new BadRequestException(
        'There is already an active session for this table.',
      );
    }

    const tableSession = this.tableSessionRepository.create({
      table,
      status,
      sessionToken: uuidv4(),
      startedAt: new Date(),
      endedAt: null,
    });
    await this.tableSessionRepository.save(tableSession);
    return tableSession;
  }

  findAll(findAllTableSessionDto?: FindAllTableSessionDto) {
    const tableId = findAllTableSessionDto?.tableId;
    const status = findAllTableSessionDto?.status;
    const query =
      this.tableSessionRepository.createQueryBuilder('tableSession');

    if (tableId) {
      query.andWhere('tableSession.table_id = :tableId', { tableId });
    }

    if (status) {
      query.andWhere('tableSession.status = :status', { status });
    }

    return query.getMany();
  }

  findOne(id: number) {
    return this.tableSessionRepository.findOne({ where: { id } });
  }

  findOneBySessionToken(sessionToken: string) {
    if (!sessionToken) {
      throw new NotFoundException('Not found table session.');
    }
    return this.tableSessionRepository.findOne({
      where: { sessionToken, status: TableSessionStatus.ACTIVE },
    });
  }

  private findActiveSessionByTableId(tableId: number) {
    return this.tableSessionRepository.findOne({
      where: { table: { id: tableId }, status: TableSessionStatus.ACTIVE },
    });
  }

  async update(id: number, updateTableSessionDto: UpdateTableSessionDto) {
    const { status } = updateTableSessionDto;
    const tableSession = await this.findOne(id);
    if (!tableSession) {
      throw new NotFoundException('Table session not found.');
    }

    if (
      tableSession.status === TableSessionStatus.CLOSED ||
      !!tableSession.endedAt
    ) {
      throw new BadRequestException('Cannot update a closed session.');
    }

    tableSession.status = status;
    if (status === TableSessionStatus.CLOSED) {
      tableSession.endedAt = new Date();
    }
    await this.tableSessionRepository.save(tableSession);

    return tableSession;
  }
}
