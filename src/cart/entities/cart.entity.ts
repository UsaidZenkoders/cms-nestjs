import { Course } from "src/courses/entities/course.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    quantity:number
    @Column()
    price:number
    @OneToMany(()=>Course,(course)=>course.cart)
    @JoinColumn({name:'course_code'})
    course_code:Course
    
}