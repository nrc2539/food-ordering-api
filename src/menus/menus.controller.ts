import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/access-control/guards/roles.guard';
import { Roles } from 'src/access-control/decorators/roles.decorator';
import { FindAllMenuDto } from './dto/find-all-menu.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findAll(@Query() findAllMenuDto: FindAllMenuDto) {
    return this.menusService.findAllMenuItems(findAllMenuDto);
  }

  @Get('categories')
  findAllMenuCategories() {
    return this.menusService.findAllMenuCategories();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOneMenuCategory(@Param('id') id: string) {
    return this.menusService.findOneMenuCategory(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('categories')
  createMenuCategory(@Body() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menusService.createMenuCategory(createMenuCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('categories/:id')
  updateMenuCategory(
    @Param('id') id: string,
    @Body() updateMenuCategoryDto: UpdateMenuCategoryDto,
  ) {
    return this.menusService.updateMenuCategory(+id, updateMenuCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('categories/:id')
  removeMenuCategory(@Param('id') id: string) {
    return this.menusService.removeMenuCategory(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  createMenuItem(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.createMenuItem(createMenuDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOneMenuItem(@Param('id') id: string) {
    return this.menusService.findOneMenuItem(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  updateMenuItem(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return this.menusService.updateMenuItem(+id, updateMenuDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  removeMenuItem(@Param('id') id: string) {
    return this.menusService.removeMenuItem(+id);
  }
}
