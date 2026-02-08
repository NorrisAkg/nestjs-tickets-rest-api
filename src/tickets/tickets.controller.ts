import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketResource } from './dto/tickets.resource.dto';
import { PaginatedResource } from 'src/dto/paginated.resource.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketModel } from 'generated/prisma/models';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    async index() {
        let tickets = await this.ticketsService.getAllPaginated();
        const data = tickets.data.map(res => new TicketResource(res));
        const response = { ...tickets, data }

        // return tickets.map(t => new TicketResource(t));

        return new PaginatedResource<TicketResource>(response);
    }

    @Post()
    async create(@Body() data: CreateTicketDto) {
        const ticket = await this.ticketsService.create(data);

        return new TicketResource(ticket);
    }

    @Get(":id")
    async show(@Param("id") id: TicketModel["id"], @Query("with_author") withAuthor: boolean) {
        const ticket = await this.ticketsService.findById(id, withAuthor);

        return new TicketResource(ticket);
    }
}
