import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    @Length(8)
    password?: string;
}
