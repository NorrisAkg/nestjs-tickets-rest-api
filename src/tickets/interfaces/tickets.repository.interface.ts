import { PrismaPromise } from '@prisma/client/runtime/client';
import type { TicketModel } from '../../../generated/prisma/models/Ticket';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { FilterTicketsDto } from '../dto/filter-tickets.dto';

export interface TicketRepositoryInterface {
    /** Return all tickets */
    all: ({ withAuthor }: { withAuthor?: boolean }) => Promise<TicketModel[]>;

    paginate({ withAuthor }: { withAuthor?: boolean }, filterParams: FilterTicketsDto): Promise<{ data: TicketModel[], meta: { page: number, perPage: number, total: number, totalPages: number } }>

    create: (data: CreateTicketDto) => Promise<TicketModel>;

    update: (ticketId: TicketModel["id"], data: UpdateTicketDto) => Promise<TicketModel>;

    /** Return one ticket by id or null if not found */
    findById: (id: TicketModel["id"]) => Promise<TicketModel | null>;

    delete: (id: TicketModel["id"]) => void;
}