import { UserModel } from "generated/prisma/models";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export interface UsersRepositoryInterface {
    findById(id: UserModel["id"]): Promise<UserModel | null>;
    findByEmail(email: UserModel["email"]): Promise<UserModel | null>;
    create(data: CreateUserDto): Promise<UserModel>;
    update(userId: UserModel["id"], data: UpdateUserDto): Promise<UserModel>;
}
