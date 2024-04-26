import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from './user.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  // @Column()
  // userId: number;

  // @ManyToOne(() => User, (user) => user.chats)
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  // user: User;

  @Column()
  text: string;

  // @CreateDateColumn()
  // createdAt: Date;
}
