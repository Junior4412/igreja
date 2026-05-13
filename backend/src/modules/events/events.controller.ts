import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@GetCurrentUser('churchId') churchId: string, @Body() dto: any) {
    return this.eventsService.create(churchId, dto);
  }

  @Get()
  findAll(@GetCurrentUser('churchId') churchId: string) {
    return this.eventsService.findAll(churchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.eventsService.findOne(id, churchId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUser('churchId') churchId: string,
    @Body() dto: any,
  ) {
    return this.eventsService.update(id, churchId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.eventsService.remove(id, churchId);
  }
}
