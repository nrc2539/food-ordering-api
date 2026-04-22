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

  findAll(): Promise<Table[]> {
    return this.tableRepository.find();
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

  async remove(id: number): Promise<void> {
    const table = await this.findOne(id);
    if (!table) {
      throw new NotFoundException('Table not found.');
    }
    await this.tableRepository.remove(table);
  }
}
