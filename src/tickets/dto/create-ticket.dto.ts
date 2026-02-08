import { IsNotEmpty, IsString } from "class-validator";
import { UserModel } from "generated/prisma/models";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    authorId: UserModel['id'];
}
