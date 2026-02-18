import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketResource } from './dto/ticket.resource';
import { PaginatedResource } from 'src/common/dto/paginated.resource.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketModel } from 'generated/prisma/models';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketsDto } from './dto/filter-tickets.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    async index(@Query() filterDto: FilterTicketsDto): Promise<PaginatedResource<TicketResource>> {
        const tickets = await this.ticketsService.getAllPaginated(filterDto);
        const data = tickets.data.map(t => new TicketResource(t));
        return new PaginatedResource<TicketResource>({ ...tickets, data });
    }

    @Post()
    async create(
        @Body() data: CreateTicketDto,
        @Request() req: { user: { sub: string } },
    ): Promise<TicketResource> {
        const ticket = await this.ticketsService.create(data, req.user.sub);
        return new TicketResource(ticket);
    }

    @Get(':id')
    async show(
        @Param('id') id: TicketModel['id'],
        @Query('with_author') withAuthor: boolean,
    ): Promise<TicketResource> {
        const ticket = await this.ticketsService.findById(id, withAuthor);
        return new TicketResource(ticket);
    }

    @Patch(':id')
    async update(
        @Param('id') id: TicketModel['id'],
        @Body() data: UpdateTicketDto,
    ): Promise<TicketResource> {
        const ticket = await this.ticketsService.update(id, data);
        return new TicketResource(ticket);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: TicketModel['id']): Promise<{ message: string }> {
        await this.ticketsService.delete(id);
        return { message: 'Ticket deleted successfully' };
    }
}
