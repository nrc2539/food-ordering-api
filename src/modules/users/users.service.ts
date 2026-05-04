import * as bcrypt from 'bcrypt';
import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private roleService: RolesService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password, roleId } = createUserDto;
    if (!name) {
      throw new BadRequestException('User name is required.');
    }

    const role = await this.roleService.findOne(roleId);
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashPassword,
      role,
    });
    await this.userRepository.save(user);

    return user;
  }

  async findAll(findAllUserDto: FindAllUserDto) {
    const roleIds = findAllUserDto.roleIds;
    const query = this.userRepository.createQueryBuilder('user');
    query.leftJoinAndSelect('user.role', 'role');
    query.addOrderBy('user.id', 'ASC');

    if (roleIds && roleIds.length > 0) {
      query.andWhere('role.id IN (:...roleIds)', { roleIds });
    }

    return query.getMany();
  }

  async findOne({
    id,
    select,
  }: {
    id: number;
    select?: FindOptionsSelect<User>;
  }) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: select || { id: true, name: true, email: true },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roleId, name } = updateUserDto;
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.roleService.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Not found role for user.');
    }

    if (name) {
      user.name = name;
    }
    user.role = role;
    await this.userRepository.save(user);

    return user;
  }

  async remove(id: number) {
    const user = await this.findOne({ id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    await this.userRepository.softDelete(id);
    return { message: 'User removed successfully.' };
  }
}
