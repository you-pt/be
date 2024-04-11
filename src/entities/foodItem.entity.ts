import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'foodItem' })
export class FoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodName: string; // Replace with the appropriate name

  @Column('float')
  weight: number;

  @Column('float')
  energy: number;

  @Column('float')
  carbohydrate: number;

  @Column('float')
  sugar: number;

  @Column('float')
  fat: number;

  @Column('float')
  protein: number;

  @Column('float')
  calcium: number;

  @Column('float')
  phosphorus: number;

  @Column('float')
  sodium: number;

  @Column('float')
  potassium: number;

  @Column('float')
  magnesium: number;

  @Column('float')
  iron: number;

  @Column('float')
  zinc: number;

  @Column('float')
  cholesterol: number;

  @Column('float')
  transFats: number;
}
