import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { FindAllOrderDto } from './dto/find-all-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() findAllOrderDto: FindAllOrderDto) {
    return this.ordersService.findAll(findAllOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: { user: User },
  ) {
    const userId = req.user.id; // DESC: get the authenticated user from the request
    return this.ordersService.update(+id, updateOrderDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Get('table-session/:tableSessionToken')
  findAllCustomerOrderInTableSession(
    @Param('tableSessionToken') tableSessionToken: string,
  ) {
    return this.ordersService.findAll({ sessionToken: tableSessionToken });
  }
}
