import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { TicketModel } from 'generated/prisma/models';
import { PrismaPromise } from '@prisma/client/runtime/client';
import { TicketResource } from './dto/tickets.resource.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UsersRepository } from 'src/users/users.repository';

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

    async getAllPaginated(): Promise<{ data: TicketModel[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        const response = await this.ticketRepository.paginate({
            withAuthor: true
        }, {
            perPage: 10
        });

        return response;
    }
}
