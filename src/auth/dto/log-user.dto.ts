import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LogUserDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;
}
