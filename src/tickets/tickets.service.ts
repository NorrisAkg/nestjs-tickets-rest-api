import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { TicketModel } from 'generated/prisma/models';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersRepository } from 'src/users/users.repository';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';

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

    async create(data: CreateTicketDto): Promise<TicketModel> {
        console.log("author id", data.authorId);
        const user = await this.userRepository.findById(data.authorId);

        console.log(user);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return this.ticketRepository.create(data);
    }

    async getAllPaginated(filterParams: FilterTicketsDto): Promise<{ data: TicketModel[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        console.log("display params in service", filterParams)
        const response = await this.ticketRepository.paginate({
            withAuthor: true
        }, {
            page: filterParams.page ?? 1,
            perPage: filterParams.perPage ?? 10,
        });

        return response;
    }

    async findById(ticketId: TicketModel["id"], withAuthor?: boolean): Promise<TicketModel> {
        const ticket = await this.ticketRepository.findById(ticketId, withAuthor);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        return ticket;
    }

    async update(ticketId: TicketModel["id"], data: UpdateTicketDto): Promise<TicketModel> {
        const ticket = await this.ticketRepository.findById(ticketId);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        return await this.ticketRepository.update(ticketId, data);
    }

    async delete(ticketId: TicketModel["id"]): Promise<void> {
        const ticket = await this.ticketRepository.findById(ticketId);

        if (!ticket) {
            throw new NotFoundException("Ticket not found");
        }

        return this.ticketRepository.delete(ticketId);
    }
}
