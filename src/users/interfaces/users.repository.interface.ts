import { UserModel } from "generated/prisma/models";

export interface UsersRepositoryInterface {
    findById(id: UserModel["id"]): Promise<UserModel | null>;
}