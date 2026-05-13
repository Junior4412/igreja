import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(churchId: string, dto: any) {
    return this.prisma.event.create({
      data: {
        ...dto,
        churchId,
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.event.findMany({
      where: { churchId },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, churchId: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, churchId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, churchId: string, dto: any) {
    await this.findOne(id, churchId);
    return this.prisma.event.update({ where: { id }, data: dto });
  }

  async remove(id: string, churchId: string) {
    await this.findOne(id, churchId);
    return this.prisma.event.delete({ where: { id } });
  }
}
