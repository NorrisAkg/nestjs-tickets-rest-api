import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { TicketModel } from 'generated/prisma/models';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersRepository } from 'src/users/users.repository';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { Ticket } from './entities/ticket';

@Injectable()
export class TicketsService {
    constructor(private readonly ticketRepository: TicketsRepository,
        private userRepository: UsersRepository
    ) { }

    async getAll(): Promise<TicketModel[]> {
        return await this.ticketRepository.all({
            withAuthor: true
        });
    }

    async create(data: CreateTicketDto): Promise<Ticket> {
        const user = await this.userRepository.findById(data.authorId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const ticket = await this.ticketRepository.create(data);

        return new Ticket(ticket);
    }

    async getAllPaginated(filterParams: FilterTicketsDto): Promise<{ data: Ticket[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        console.log("display params in service", filterParams)
        const response = await this.ticketRepository.paginate({
            withAuthor: true
        }, {
            page: filterParams.page ?? 1,
            perPage: filterParams.perPage ?? 10,
        });

        const mappedTickets = response.data.map(t => new Ticket(t));

        return { ...response, data: mappedTickets };
    }

    async findById(ticketId: Ticket["id"], withAuthor?: boolean): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(ticketId, withAuthor);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        return new Ticket(ticket);
    }

    async update(ticketId: Ticket["id"], data: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(ticketId);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        const response = await this.ticketRepository.update(ticketId, data);

        return new Ticket(response);
    }

    async delete(ticketId: Ticket["id"]): Promise<void> {
        const ticket = await this.ticketRepository.findById(ticketId);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        return this.ticketRepository.delete(ticketId);
    }
}
