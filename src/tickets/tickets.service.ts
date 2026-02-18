import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersRepository } from 'src/users/users.repository';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
    constructor(
        private readonly ticketRepository: TicketsRepository,
        private readonly userRepository: UsersRepository,
    ) { }

    async create(data: CreateTicketDto, authorId: string): Promise<Ticket> {
        const user = await this.userRepository.findById(authorId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const ticket = await this.ticketRepository.create({ ...data, authorId });
        return new Ticket(ticket);
    }

    async getAllPaginated({ page = 1, perPage = 10, search }: FilterTicketsDto): Promise<{ data: Ticket[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        const response = await this.ticketRepository.paginate(
            { withAuthor: true },
            { page, perPage, search },
        );
        return { ...response, data: response.data.map(t => new Ticket(t)) };
    }

    async findById(ticketId: Ticket['id'], withAuthor?: boolean): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(ticketId, withAuthor);
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        return new Ticket(ticket);
    }

    async update(ticketId: Ticket['id'], data: UpdateTicketDto): Promise<Ticket> {
        await this.findById(ticketId);
        const updated = await this.ticketRepository.update(ticketId, data);
        return new Ticket(updated);
    }

    async delete(ticketId: Ticket['id']): Promise<void> {
        await this.findById(ticketId);
        return this.ticketRepository.delete(ticketId);
    }
}
