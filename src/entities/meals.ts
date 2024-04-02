import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menus';

@Entity({name:"meals"})
export class Meal {
  @PrimaryGeneratedColumn()
  mealId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (User) => User.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column()
  reportAI: string

  @Column()
  report: string

  @CreateDateColumn()
  createdAt: string

  @OneToMany(() => Menu, menu => menu.meal)
  menus: Menu[]
}
