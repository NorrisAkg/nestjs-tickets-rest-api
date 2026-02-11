import { Injectable } from '@nestjs/common';
import { TicketRepositoryInterface } from './interfaces/tickets.repository.interface';
import { TicketModel } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma.service';
import { PrismaPromise } from '@prisma/client/runtime/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';
import { filter } from 'rxjs';

@Injectable()
export class TicketsRepository implements TicketRepositoryInterface {
    constructor(private readonly prisma: PrismaService) { }
    async all({ withAuthor }: { withAuthor?: boolean }): Promise<TicketModel[]> {
        const response = await this.prisma.ticket.findMany({
            include: { author: withAuthor }
        });

        return response;
    }

    async paginate({ withAuthor }: { withAuthor?: boolean }, filterParams: FilterTicketsDto): Promise<{ data: TicketModel[], meta: { page: number, perPage: number, total: number, totalPages: number } }> {
        const { page, perPage, search } = filterParams;
        const where = {
            title: {
                contains: search
            }
        };

        const [total, tickets] = await this.prisma.$transaction([
            this.prisma.ticket.count({ where }),
            this.prisma.ticket.findMany({
                where,
                include: { author: withAuthor },
                skip: perPage! * (page! - 1),
                take: perPage,
            })
        ]);

        return {
            data: tickets,
            meta: {
                page: page!,
                perPage: perPage!,
                total,
                totalPages: Math.ceil(total / (perPage ?? 10))
            }
        };
    }

    findById(id: TicketModel["id"], withAuthor?: boolean): Promise<TicketModel | null> {
        return this.prisma.ticket.findUnique({
            where: { id },
            include: {
                author: !!withAuthor
            }
        });
    }

    async create(data: CreateTicketDto): Promise<TicketModel> {
        return await this.prisma.ticket.create({ data })
    }

    async update(ticketId: TicketModel["id"], data: UpdateTicketDto): Promise<TicketModel> {
        return await this.prisma.ticket.update({
            where: {
                id: ticketId
            },
            data
        })
    }

    async delete(id: TicketModel["id"]): Promise<void> {
        await this.prisma.ticket.delete({
            where: { id }
        })
    };

}
