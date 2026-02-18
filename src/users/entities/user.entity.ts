import { UserModel } from 'generated/prisma/models';
import { Ticket } from 'src/tickets/entities/ticket.entity';

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
        this.createdAt = new Date(userModel.createdAt);
        this.updatedAt = new Date(userModel.updatedAt);
        this.tickets = userModel.tickets;
    }
}
