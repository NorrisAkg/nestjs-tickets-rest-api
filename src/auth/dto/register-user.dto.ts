import { IsEmail, IsNotEmpty, IsString, Min } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class RegisterUserDto extends CreateUserDto {

}
