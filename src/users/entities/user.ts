import { UserModel } from "generated/prisma/models";

export class User {
    private readonly id: string;
    name: string;
    email: string;

    constructor(userModel: UserModel) {
        this.id = userModel.id;
        this.name = userModel.name!;
        this.email = userModel.email;
    }
}