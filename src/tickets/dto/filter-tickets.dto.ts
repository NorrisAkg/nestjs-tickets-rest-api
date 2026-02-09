import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class FilterTicketsDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    perPage?: number;

    @IsString()
    @IsOptional()
    title?: string;
}
