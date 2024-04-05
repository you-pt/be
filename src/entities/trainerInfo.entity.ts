import { User } from './user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({name: "trainInfos"})
export class TrainerInfo{
  @PrimaryGeneratedColumn()
  trainerInfoId: number;
  
  @Column()
  userId: number

  @OneToOne(() => User, user => user.trainerInfo, { onDelete: 'CASCADE' })
  @JoinColumn({name: "userId", referencedColumnName: "id"})
  user: User

  @Column()
  major: string

  @Column()
  career: string

  @Column({type: 'json', nullable: false})
  certifications: string[]
}
