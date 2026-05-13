import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CellsService } from './cells.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@Controller('cells')
@UseGuards(JwtAuthGuard)
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  @Post()
  create(@GetCurrentUser('churchId') churchId: string, @Body() dto: any) {
    return this.cellsService.create(churchId, dto);
  }

  @Get()
  findAll(@GetCurrentUser('churchId') churchId: string) {
    return this.cellsService.findAll(churchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.cellsService.findOne(id, churchId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUser('churchId') churchId: string,
    @Body() dto: any,
  ) {
    return this.cellsService.update(id, churchId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.cellsService.remove(id, churchId);
  }
}
