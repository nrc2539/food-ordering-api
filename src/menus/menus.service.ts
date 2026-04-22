import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { MenuCategory } from './entities/menu-category.entity';
import { FindAllMenuDto } from './dto/find-all-menu.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
  ) {}

  findAllMenuCategories() {
    return this.menuCategoryRepository.find({
      relations: ['menuItems'],
      order: { id: 'ASC' },
    });
  }

  async findOneMenuCategory(id: number) {
    const menuCategory = await this.menuCategoryRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!menuCategory) {
      throw new NotFoundException('Menu category not found.');
    }
    return menuCategory;
  }

  async createMenuCategory(createMenuCategoryDto: CreateMenuCategoryDto) {
    const { name } = createMenuCategoryDto;
    const menuCategory = this.menuCategoryRepository.create({ name });
    await this.menuCategoryRepository.save(menuCategory);

    return menuCategory;
  }

  async updateMenuCategory(
    id: number,
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    const { name } = updateMenuCategoryDto;
    const menuCategory = await this.findOneMenuCategory(id);
    if (!menuCategory) {
      throw new NotFoundException('Menu category not found.');
    }
    if (!name) {
      throw new BadRequestException('Name is required.');
    }
    menuCategory.name = name;
    await this.menuCategoryRepository.save(menuCategory);

    return menuCategory;
  }

  async removeMenuCategory(id: number): Promise<{ message: string }> {
    const menuCategory = await this.findOneMenuCategory(id);
    if (!menuCategory) {
      throw new NotFoundException('Menu category not found.');
    }
    await this.menuCategoryRepository.remove(menuCategory);
    return { message: 'Menu category removed successfully.' };
  }

  async createMenuItem(createMenuDto: CreateMenuDto) {
    const { name, price, categoryId } = createMenuDto;
    const isAvailable = createMenuDto.isAvailable ?? true;
    const menuCategory = await this.findOneMenuCategory(categoryId);
    if (!menuCategory) {
      throw new BadRequestException('Menu category not exist.');
    }
    const menuItem = this.menuItemRepository.create({
      name,
      price,
      isAvailable,
      category: menuCategory,
    });
    await this.menuItemRepository.save(menuItem);

    return menuItem;
  }

  findAllMenuItems(findAllMenuDto: FindAllMenuDto) {
    const categoryId = findAllMenuDto.categoryId;
    const isAvailable = findAllMenuDto.isAvailable;
    const query = this.menuItemRepository.createQueryBuilder('menuItem');

    if (categoryId) {
      query.where('menuItem.category_id = :categoryId', { categoryId });
    }

    if (isAvailable !== undefined) {
      query.andWhere('menuItem.isAvailable = :isAvailable', { isAvailable });
    }

    query.leftJoinAndSelect('menuItem.category', 'category');
    query.addOrderBy('menuItem.id', 'ASC');

    return query.getMany();
  }

  async findOneMenuItem(id: number) {
    const menuItem = await this.menuItemRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found.');
    }
    return menuItem;
  }

  async updateMenuItem(id: number, updateMenuDto: UpdateMenuDto) {
    const { name, price, categoryId } = updateMenuDto;
    const isAvailable = updateMenuDto.isAvailable;
    const menuItem = await this.findOneMenuItem(id);
    const menuCategory = await this.findOneMenuCategory(categoryId);
    if (!menuCategory) {
      throw new BadRequestException('Menu category not exist.');
    }
    if (!menuItem) {
      throw new NotFoundException('Menu item not found.');
    }
    if (name) {
      menuItem.name = name;
    }
    menuItem.price = price;
    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    }
    menuItem.category = { id: categoryId } as MenuCategory;
    await this.menuItemRepository.save(menuItem);
    return menuItem;
  }

  async removeMenuItem(id: number): Promise<{ message: string }> {
    const menuItem = await this.findOneMenuItem(id);
    if (!menuItem) {
      throw new NotFoundException('Menu item not found.');
    }
    await this.menuItemRepository.remove(menuItem);
    return { message: 'Menu item removed successfully.' };
  }
}
