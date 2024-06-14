import { IsNotEmpty, IsString } from "class-validator";

export class LoginStudentDto{
    @IsNotEmpty()
    @IsString()
    email:string

    @IsNotEmpty()
    @IsString()
    password:string

    role:string="STUDENT"
}