import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  name: string;

  @Column()
  text: string;

  // constructor(roomId?: string, name?: string, text?: string) {
  //   this.roomId = roomId;
  //   this.name = name;
  //   this.text = text;
  // }
}
