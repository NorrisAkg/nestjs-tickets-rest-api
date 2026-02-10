import { TicketModel, UserModel } from 'generated/prisma/models';
import { TicketStatus } from 'generated/prisma/enums';
import { UserResource } from 'src/users/dto/users.resource.dto';
import { ModelResource } from 'src/common/dto/model.resource.dto';
import { Ticket } from '../entities/ticket';
export class TicketResource extends ModelResource {
    id: string
    title: string
    description: string | null;
    status: TicketStatus;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author?: UserResource;

    constructor(ticket: Ticket) {
        super();
        this.id = ticket.id;
        this.title = ticket.title;
        this.authorId = ticket.authorId;
        this.description = ticket.description ?? "";
        this.status = ticket.status;
        this.createdAt = ticket.createdAt.toString();
        this.updatedAt = ticket.updatedAt.toDateString();
        this.author = ticket.author ? new UserResource(ticket.author) : undefined
    }
}