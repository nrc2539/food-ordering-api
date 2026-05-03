import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';
import { TableSessionStatus } from 'src/table-sessions/table-session.enum';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table) private tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    const { name } = createTableDto;
    if (!name) {
      throw new BadRequestException('Table name is required.');
    }
    const table = this.tableRepository.create({ name });
    await this.tableRepository.save(table);

    return table;
  }

  async findAll(): Promise<Table[]> {
    const data = await this.tableRepository
      .createQueryBuilder('table')
      .leftJoinAndSelect(
        'table.sessions',
        'session',
        'session.status != :status',
        { status: TableSessionStatus.CLOSED },
      )
      .orderBy('table.id', 'ASC')
      .getMany();

    return data.map((v) => ({
      ...v,
      isAvailable: v.sessions.length === 0,
      activeSession: v.sessions[0] || null,
    }));
  }

  async findOne(id: number): Promise<Table | null> {
    const table = await this.tableRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException('Table not found.');
    }

    return table;
  }

  async update(
    id: number,
    updateTableDto: UpdateTableDto,
  ): Promise<Table | null> {
    const { name } = updateTableDto;
    const table = await this.findOne(id);
    if (!table || !name) {
      throw new BadRequestException('Table not found or name is missing.');
    }
    table.name = name;
    await this.tableRepository.save(table);
    return table;
  }

  async remove(id: number): Promise<{ message: string }> {
    const table = await this.findOne(id);
    if (!table) {
      throw new NotFoundException('Table not found.');
    }
    await this.tableRepository.softDelete(id);
    return { message: 'Table removed successfully.' };
  }
}
