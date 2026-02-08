import { PrismaPromise } from '@prisma/client/runtime/client';
import type { TicketModel } from '../../../generated/prisma/models/Ticket';
import { CreateTicketDto } from '../dto/create-ticket.dto';

export interface TicketRepositoryInterface {
    /** Return all tickets */
    all: ({ withAuthor }: { withAuthor?: boolean }) => Promise<TicketModel[]>;

    create: (data: CreateTicketDto) => Promise<TicketModel>

    /** Return one ticket by id or null if not found */
    findById: (id: TicketModel["id"]) => Promise<TicketModel | null>;

    delete: (id: TicketModel["id"]) => void;
}