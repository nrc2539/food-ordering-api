import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TableSessionsService } from './table-sessions.service';
import { CreateTableSessionDto } from './dto/create-table-session.dto';
import { UpdateTableSessionDto } from './dto/update-table-session.dto';
import { FindAllTableSessionDto } from './dto/find-all-table-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('table-sessions')
export class TableSessionsController {
  constructor(private readonly tableSessionsService: TableSessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTableSessionDto: CreateTableSessionDto) {
    return this.tableSessionsService.create(createTableSessionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() findAllTableSessionDto: FindAllTableSessionDto) {
    return this.tableSessionsService.findAll(findAllTableSessionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableSessionsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTableSessionDto: UpdateTableSessionDto,
  ) {
    return this.tableSessionsService.update(+id, updateTableSessionDto);
  }

  @Get('session-tokens/:sessionToken') // DESC: endpoint to find a table session by its session token for QR code scanning
  findOneBySessionToken(@Param('sessionToken') sessionToken: string) {
    return this.tableSessionsService.findOneBySessionToken(sessionToken);
  }
}
