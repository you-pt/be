import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({name: "trainInfos"})
export class TrainerInfo{
  @PrimaryGeneratedColumn()
  trainerInfoId: number;
  
  @Column()
  userId: number

  @OneToOne(() => User, user => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({name: "userId", referencedColumnName: "userId"})
  user: User

  @Column()
  major: string

  @Column()
  career: string

  @Column()
  certifications: string[]
}