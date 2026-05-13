import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(churchId: string, dto: CreateMemberDto) {
    return this.prisma.member.create({
      data: {
        ...dto,
        churchId,
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.member.findMany({
      where: { churchId },
      include: {
        cell: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, churchId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id, churchId },
      include: { cell: true },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }

  async update(id: string, churchId: string, dto: any) {
    await this.findOne(id, churchId);

    return this.prisma.member.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, churchId: string) {
    await this.findOne(id, churchId);
    return this.prisma.member.delete({ where: { id } });
  }
}
