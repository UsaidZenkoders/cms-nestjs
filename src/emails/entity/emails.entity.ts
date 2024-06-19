import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Emails {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Column({ default: null })
  role: string;
}
