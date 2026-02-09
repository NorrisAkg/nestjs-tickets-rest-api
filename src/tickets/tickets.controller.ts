import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketResource } from './dto/tickets.resource.dto';
import { PaginatedResource } from 'src/dto/paginated.resource.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketModel } from 'generated/prisma/models';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    async index(@Query() filterDto: FilterTicketsDto) {
        let tickets = await this.ticketsService.getAllPaginated({ page: filterDto.page, perPage: filterDto.perPage });
        const data = tickets.data.map(res => new TicketResource(res));
        const response = { ...tickets, data }

        return new PaginatedResource<TicketResource>(response);
    }

    @Post()
    async create(@Body() data: CreateTicketDto) {
        const createdTicket = await this.ticketsService.create(data);

        return new TicketResource(createdTicket);
    }

    @Get(":id")
    async show(@Param("id") id: TicketModel["id"], @Query("with_author") withAuthor: boolean) {
        const ticket = await this.ticketsService.findById(id, withAuthor);

        return new TicketResource(ticket);
    }

    @Patch(":id")
    async update(@Param("id") id: TicketModel["id"], @Body() data: UpdateTicketDto) {
        const updatedTicket = await this.ticketsService.update(id, data);

        return new TicketResource(updatedTicket);
    }

    @Delete(":id")
    @HttpCode(204)
    async delete(@Param("id") id: TicketModel["id"]) {
        await this.ticketsService.delete(id);

        return {
            message: "Ticket supprimé avec succès",
            code: 204
        };
    }
}
