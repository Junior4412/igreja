import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@Controller('finances')
@UseGuards(JwtAuthGuard)
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  @Post()
  create(@GetCurrentUser('churchId') churchId: string, @Body() dto: any) {
    return this.financesService.create(churchId, dto);
  }

  @Get()
  findAll(@GetCurrentUser('churchId') churchId: string) {
    return this.financesService.findAll(churchId);
  }

  @Get('summary')
  getSummary(@GetCurrentUser('churchId') churchId: string) {
    return this.financesService.getSummary(churchId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.financesService.remove(id, churchId);
  }
}
