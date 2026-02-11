import { TicketModel, UserModel } from 'generated/prisma/models';
import { TicketResource } from 'src/tickets/dto/tickets.resource.dto';
import { Ticket } from 'src/tickets/entities/ticket';
import { User } from '../entities/user';
export class UserResource {
    id: string
    name: string
    email: string;
    createdAt: string;
    updatedAt: string;
    tickets?: TicketResource[];

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name!;
        this.email = user.email ?? "";
        this.createdAt = user.createdAt.toISOString();
        this.updatedAt = user.updatedAt.toISOString();
        this.tickets = user.tickets ? user.tickets.map((t) => new TicketResource(t)) : undefined
    }
}