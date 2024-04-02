import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Meal } from "./meals";

@Entity({name: "menus"})
export class Menu {
  @PrimaryGeneratedColumn()
  menuId: number

  @Column()
  mealId: number

  @ManyToOne(() => Meal, meal => meal.menus, { onDelete: 'CASCADE' })
  @JoinColumn({name: "mealId", referencedColumnName: "mealId"})
  meal: Meal

  @Column()
  name: string

  @Column()
  kcal: number
}