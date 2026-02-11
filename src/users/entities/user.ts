import { UserModel } from "generated/prisma/models";
import { Ticket } from "src/tickets/entities/ticket";

export class User {
    readonly id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    tickets?: Ticket[];

    constructor(userModel: UserModel & { tickets?: Ticket[] }) {
        this.id = userModel.id;
        this.name = userModel.name!;
        this.email = userModel.email;
        this.createdAt = userModel.createdAt;
        this.updatedAt = userModel.updatedAt;
        this.tickets = userModel.tickets;
    }
}