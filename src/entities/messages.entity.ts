import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from './schedules.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column()
  scheduleId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.messages)
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'scheduleId' })
  schedule: Schedule;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  transportTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
