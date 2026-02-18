import { TicketStatus } from 'generated/prisma/enums';
import { TicketModel } from 'generated/prisma/models';
import { User } from 'src/users/entities/user.entity';

export class Ticket implements Partial<TicketModel> {
    public readonly id: string;
    title: string;
    description?: string | null;
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author?: User;

    constructor(ticketModel: TicketModel & { author?: User }) {
        this.id = ticketModel.id;
        this.title = ticketModel.title;
        this.description = ticketModel.description;
        this.status = ticketModel.status;
        this.authorId = ticketModel.authorId;
        this.author = ticketModel.author;
        this.createdAt = ticketModel.createdAt;
        this.updatedAt = ticketModel.updatedAt;
    }

    private changeStatus(status: TicketStatus): void {
        this.status = status;
    }

    open(): void {
        this.changeStatus(TicketStatus.OPEN);
    }

    close(): void {
        this.changeStatus(TicketStatus.CLOSED);
    }
}
