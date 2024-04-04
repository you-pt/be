import { Injectable } from '@nestjs/common';
import { CreateDietDto } from './dto/create-diet.dto';
import { UpdateDietDto } from './dto/update-diet.dto';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menus.entity';
import { Meal } from '../entities/meals.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DietService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
  ) {}

  async create(id: number, createDietDto: CreateDietDto) {
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
    return { meal: newMeal, menu: newMenus};
  }

  async findMenus(mealId: number) {
    const menus = await this.menuRepository.findBy({ mealId });
    return menus;
  }

  async remove(mealId: number) {
    const deletedMeal = await this.mealRepository.delete({
      mealId
    })
  }
}
