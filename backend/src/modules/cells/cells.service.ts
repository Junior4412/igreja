import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CellsService {
  constructor(private prisma: PrismaService) {}

  async create(churchId: string, dto: any) {
    return this.prisma.cell.create({
      data: {
        ...dto,
        churchId,
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.cell.findMany({
      where: { churchId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async findOne(id: string, churchId: string) {
    const cell = await this.prisma.cell.findFirst({
      where: { id, churchId },
      include: { members: true },
    });

    if (!cell) {
      throw new NotFoundException('Cell not found');
    }

    return cell;
  }

  async update(id: string, churchId: string, dto: any) {
    await this.findOne(id, churchId);
    return this.prisma.cell.update({ where: { id }, data: dto });
  }

  async remove(id: string, churchId: string) {
    await this.findOne(id, churchId);
    return this.prisma.cell.delete({ where: { id } });
  }
}
