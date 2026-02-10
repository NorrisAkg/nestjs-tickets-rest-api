import { User } from 'generated/prisma/client';
import { TicketStatus } from 'generated/prisma/enums';
import { TicketModel } from 'generated/prisma/models';
export class Ticket implements Partial<TicketModel> {
    public readonly id: string;
    title: string;
    description?: string | null;
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author?: User | undefined;

    constructor(ticketModel: TicketModel) {
        this.id = ticketModel.id;
        this.title = ticketModel.title;
        this.description = ticketModel.description;
        this.status = ticketModel.status;
        this.authorId = ticketModel.authorId;
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