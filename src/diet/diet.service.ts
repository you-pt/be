import { Injectable } from '@nestjs/common';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { DataSource, Repository } from 'typeorm';
import { Menu } from '../entities/menus.entity';
import { Meal } from '../entities/meals.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class DietService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(id: number, createDietDto: CreateDietDto) {
    const user = await this.userRepository.findOneBy({id})
    if (!user) throw {message: "사용자가 없습니다."}
    const newMeal = await this.mealRepository.save({
      userId: id,
      reportAI: null,
      report: null,
    });
    for (let i = 0; i < createDietDto.menus.length; i++) {
      const menu = createDietDto.menus[i];
      const newMenu = await this.menuRepository.save({
        mealId: newMeal.mealId,
        name: menu.name,
        kcal: menu.kcal,
      });
    }
    const newMenus = await this.menuRepository.findBy({
      mealId: newMeal.mealId,
    });
    return { meal: newMeal, menu: newMenus };
  }

  async findMenus(userId: number, mealId: number) {
    const menus = await this.dataSource
      .createQueryBuilder(Menu, 'menu')
      // .select(["*"])
      .select([
        'menu.menuId',
        'menu.mealId',
        'meal.userId',
        'menu.name',
        'menu.kcal',
      ])
      .leftJoin('menu.meal', 'meal', 'menu.mealId = meal.mealId')
      .where('menu.mealId = :mealId', { mealId })
      .andWhere('meal.userId = :userId', { userId })
      .getMany();
    // const menus = await this.menuRepository.findBy({ mealId });
    return menus;
  }

  async remove(mealId: number) {
    const deletedMeal = await this.mealRepository.delete({
      mealId,
    });
  }

  async editReport({ userId, mealId, body }) {
    const updatedMeal = await this.mealRepository.update(
      {
        mealId,
      },
      {
        report: body.report,
      },
    );
    return updatedMeal;
  }
}
