import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'trainInfos' })
export class TrainerInfo {
  @PrimaryGeneratedColumn()
  trainerInfoId: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: User;

  @Column()
  major: string;

  @Column()
  career: string;

  @Column()
  certifications: string[];
}
