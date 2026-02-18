import { TicketResource } from 'src/tickets/dto/ticket.resource';
import { User } from '../entities/user.entity';

export class UserResource {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    tickets?: TicketResource[];

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name!;
        this.email = user.email ?? '';
        this.createdAt = user.createdAt.toISOString();
        this.updatedAt = user.updatedAt.toISOString();
        this.tickets = user.tickets ? user.tickets.map((t) => new TicketResource(t)) : undefined;
    }
}
