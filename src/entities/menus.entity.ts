import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meal } from './meals.entity';

@Entity({ name: 'menus' })
export class Menu {
  @PrimaryGeneratedColumn()
  menuId: number;

  @Column()
  mealId: number;

  @ManyToOne(() => Meal, (meal) => meal.menus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id', referencedColumnName: 'mealId' })
  meal: Meal;

  @Column()
  name: string;

  @Column()
  kcal: number;
}
