import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../types/userRole.type';
import { Gender } from '../types/gender.type';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

//   @Column({ type: 'varchar', nullable: false })
//   name: string;

//   @Column({ type: 'enum', enum: Gender, nullable: false })
//   gender: Gender;

//   @Column({ type: 'varchar', nullable: false })
//   phone: string;

//   @Column({ type: 'varchar', nullable: false })
//   birth: string;

  @Column({ type: 'enum', enum: Role, default: Role.User, nullable: false })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}