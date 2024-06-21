import { OtpUsedFor } from '../../enum/otp.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp: string;
  @Column()
  user_id: string;
  // @Column({
  //   type: 'enum',
  //   enum: OtpUsedFor,
  // })
  //   usedFor: OtpUsedFor;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
  })
  expiresAt: Date;
  @Column({type:"int"})
  tries:number
}
