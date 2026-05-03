import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderStatus } from './order.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { MenuItem } from 'src/menus/entities/menu-item.entity';
import { OrderItem } from './entities/order-item.entity';
import { TableSessionsService } from 'src/table-sessions/table-sessions.service';
import { TableSessionStatus } from 'src/table-sessions/table-session.enum';
import { FindAllOrderDto } from './dto/find-all-order.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private userService: UsersService,
    private tableSessionService: TableSessionsService,
    private dataSource: DataSource,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { tableSessionToken, items } = createOrderDto;
    const tableSession =
      await this.tableSessionService.findOneBySessionToken(tableSessionToken);
    if (!tableSession || tableSession.status !== TableSessionStatus.ACTIVE) {
      throw new NotFoundException('Table session not found.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const itemIds = items.map((item) => item.menuItemId);
      const menus = await this.menuItemRepository.findBy({ id: In(itemIds) });

      let totalPrice = 0;
      // DESC: check if all menu items exist and calculate total price
      const orderItems = items.map((item) => {
        const menu = menus.find((menu) => menu.id === item.menuItemId);
        if (!menu) {
          throw new NotFoundException(
            `Menu item with id ${item.menuItemId} not found.`,
          );
        }
        const lineTotal = menu.price * item.quantity;
        totalPrice += lineTotal;
        const objOrderItem = new OrderItem();
        objOrderItem.menuItem = menu;
        objOrderItem.quantity = item.quantity;
        objOrderItem.priceAtOrderTime = menu.price; // DESC: snapshot price at order time
        return objOrderItem;
      });

      // DESC: create order and order items
      const order = new Order();
      order.tableSession = tableSession;
      order.totalPrice = totalPrice;
      order.status = OrderStatus.PENDING;
      order.orderItems = orderItems;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findAllOrderDto: FindAllOrderDto) {
    const tableSessionToken = findAllOrderDto.sessionToken;
    const status = findAllOrderDto.status;
    const query = this.orderRepository.createQueryBuilder('orders');
    query.leftJoinAndSelect('orders.tableSession', 'tableSession');
    query.leftJoinAndSelect('tableSession.table', 'table');
    query.leftJoinAndSelect('orders.orderItems', 'orderItems');
    query.leftJoinAndSelect('orderItems.menuItem', 'menuItem');
    query.orderBy('orders.id', 'DESC');
    if (status) {
      query.andWhere('orders.status = :status', { status });
    }
    if (tableSessionToken) {
      const tableSession =
        await this.tableSessionService.findOneBySessionToken(tableSessionToken);
      if (!tableSession) {
        return [];
      }
      query.andWhere('orders.tableSession = :tableSessionId', {
        tableSessionId: tableSession.id,
      });
    }
    return query.getMany();
  }

  async findOne(id: number, manager?: EntityManager) {
    const repository = manager
      ? manager.getRepository(Order)
      : this.orderRepository;
    const order = await repository.findOne({
      where: { id },
      relations: ['tableSession', 'orderItems', 'updatedBy'],
    });

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number) {
    const status = updateOrderDto.status;
    const incomingItems = updateOrderDto.items;
    return await this.dataSource.transaction(async (manager) => {
      const order = await this.findOne(id, manager);
      if (!order) {
        throw new NotFoundException('Order not found.');
      }
      order.status = status;

      const user = await this.userService.findOne({ id: userId });
      if (!user) {
        throw new NotFoundException('Updated user not found.');
      }
      order.updatedBy = user;

      if (incomingItems && incomingItems.length > 0) {
        // DESC: check menu items to delete
        const itemsToDelete = order.orderItems.filter(
          (item) => !incomingItems.find((inc) => inc.menuItemId === item.id),
        );
        await manager.remove(itemsToDelete);

        // DESC: check menu items to add
        for (const inc of incomingItems) {
          const existingItem = order.orderItems.find(
            (i) => i.id === inc.menuItemId,
          );

          if (existingItem) {
            existingItem.quantity = inc.quantity; // update quantity
            await manager.save(existingItem);
          } else {
            // add new menu item
            const menuItem = await manager.findOne(MenuItem, {
              where: { id: inc.menuItemId },
            });
            if (!menuItem) {
              throw new NotFoundException(
                `Menu item id ${inc.menuItemId} not found.`,
              );
            }
            const newItem = manager.create(OrderItem, {
              menuItemId: inc.menuItemId,
              quantity: inc.quantity,
              priceAtOrderTime: menuItem.price,
              order: order,
            });
            await manager.save(newItem);
          }
        }

        // DESC: update totalPrice in order
        const updatedItems = await manager.find(OrderItem, {
          where: { order: { id } },
        });
        order.totalPrice = updatedItems.reduce(
          (sum, i) => sum + i.priceAtOrderTime * i.quantity,
          0,
        );
      }
      return await manager.save(order);
    });
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found.');
    }
    await this.orderRepository.softDelete(id);
    return { message: 'Order removed successfully.' };
  }
}
