import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserModel } from "generated/prisma/models";

export class UpdateTicketDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
