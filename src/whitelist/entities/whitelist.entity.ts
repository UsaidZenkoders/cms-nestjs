import { Column, PrimaryGeneratedColumn ,Entity} from 'typeorm';
@Entity()
export class whitelist {
  @PrimaryGeneratedColumn()
  domainId: number;
  @Column()
  domain: string
}
