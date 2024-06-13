import { Entity,Column, PrimaryColumn } from "typeorm";
@Entity()
export class Teacher{
  
    @PrimaryColumn()
    email: string;
  
    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    address:string;

    @Column()
    age:number;

    @Column()

    contact:string;

    @Column()
    img:string;

    @Column({default:"TEACHER"})
    role:string
    
    @Column({default:false})
    is_suspended:boolean

    @Column({default:false})
    is_verified:boolean

    @Column({type:"timestamptz"})
    created_at:Date

    @Column({type:"timestamptz"})
    updated_at:Date

  
}