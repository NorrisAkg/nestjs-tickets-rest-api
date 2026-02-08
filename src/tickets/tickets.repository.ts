import { Injectable } from '@nestjs/common';
import { TicketRepositoryInterface } from './interfaces/tickets.repository.interface';
import { TicketModel } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma.service';
import { PrismaPromise } from '@prisma/client/runtime/client';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsRepository implements TicketRepositoryInterface {
    constructor(private readonly prisma: PrismaService) { }
    async all({ withAuthor }: { withAuthor?: boolean }): Promise<TicketModel[]> {
        const response = await this.prisma.ticket.findMany({
            include: { author: withAuthor }
        });

        return response;
    }

    async paginate({ withAuthor }: { withAuthor?: boolean }, { page = 1, perPage = 10 }: { page?: number, perPage: number }): Promise<{ data: TicketModel[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        const response = await this.prisma.ticket.findMany({
            include: { author: withAuthor },
            // cursor: {
            //     id: (await this.prisma.ticket.findFirst({
            //         orderBy: {
            //             createdAt: 'asc'
            //         }
            //     }))?.id
            // },
            skip: page - 1,
            take: perPage,
        });

        const total = await this.prisma.ticket.count();

        return {
            data: response,
            meta: {
                page,
                perPage,
                total,
                totalPages: Math.ceil(total / perPage)
            }
        };
    }

    findById(id: string): Promise<TicketModel | null> {
        return this.prisma.ticket.findUnique({
            where: { id }
        });
    }

    async create(data: CreateTicketDto): Promise<TicketModel> {
        return await this.prisma.ticket.create({ data })
    }

    delete(id: string): void {
        this.prisma.ticket.delete({
            where: { id }
        })
    };

}
