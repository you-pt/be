import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './messages.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @Column()
  userId: number;

  @Column()
  trainerId: number;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User, (trainer) => trainer.schedules)
  @JoinColumn({ referencedColumnName: 'id' })
  trainer: User;

  @Column()
  ptDate: string;

  @Column()
  ptTime: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(()=>Message, message => message.schedule)
  messages: Message[]
}
