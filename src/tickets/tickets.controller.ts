import { Body, Controller, Get, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketResource } from './dto/tickets.resource.dto';
import { PaginatedResource } from 'src/dto/paginated.resource.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

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
}
