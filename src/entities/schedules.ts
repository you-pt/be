import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column()
  ptDate: Date;

  @Column()
  ptTime: Date;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
