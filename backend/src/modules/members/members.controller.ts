import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@GetCurrentUser('churchId') churchId: string, @Body() dto: CreateMemberDto) {
    return this.membersService.create(churchId, dto);
  }

  @Get()
  findAll(@GetCurrentUser('churchId') churchId: string) {
    return this.membersService.findAll(churchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.membersService.findOne(id, churchId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUser('churchId') churchId: string,
    @Body() dto: any,
  ) {
    return this.membersService.update(id, churchId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUser('churchId') churchId: string) {
    return this.membersService.remove(id, churchId);
  }
}
