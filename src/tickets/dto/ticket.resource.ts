import { TicketStatus } from 'generated/prisma/enums';
import { UserResource } from 'src/users/dto/user.resource';
import { Ticket } from '../entities/ticket.entity';

export class TicketResource {
    id: string;
    title: string;
    description: string | null;
    status: TicketStatus;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author?: UserResource;

    constructor(ticket: Ticket) {
        this.id = ticket.id;
        this.title = ticket.title;
        this.authorId = ticket.authorId;
        this.description = ticket.description ?? null;
        this.status = ticket.status;
        this.createdAt = ticket.createdAt.toISOString();
        this.updatedAt = ticket.updatedAt.toISOString();
        this.author = ticket.author ? new UserResource(ticket.author) : undefined;
    }
}
