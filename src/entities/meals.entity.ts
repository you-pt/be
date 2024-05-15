import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menus.entity';
import { User } from './user.entity';

@Entity({ name: 'meals' })
export class Meal {
  @PrimaryGeneratedColumn()
  mealId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (User) => User.meals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column('json')
  reportAI: any;

  @Column({ nullable: true })
  report: string;

  @CreateDateColumn()
  createdAt: string;

  @OneToMany(() => Menu, (menu) => menu.meal)
  menus: Menu[];
}
