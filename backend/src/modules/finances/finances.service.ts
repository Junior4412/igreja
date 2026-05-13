import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinancesService {
  constructor(private prisma: PrismaService) {}

  async create(churchId: string, dto: any) {
    return this.prisma.finance.create({
      data: {
        ...dto,
        churchId,
      },
    });
  }

  async findAll(churchId: string) {
    return this.prisma.finance.findMany({
      where: { churchId },
      orderBy: { date: 'desc' },
    });
  }

  async getSummary(churchId: string) {
    const finances = await this.prisma.finance.findMany({
      where: { churchId },
    });

    const income = finances
      .filter((f) => f.type === 'TITHES' || f.type === 'OFFERING')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = finances
      .filter((f) => f.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  }

  async remove(id: string, churchId: string) {
    const finance = await this.prisma.finance.findFirst({
      where: { id, churchId },
    });

    if (!finance) {
      throw new NotFoundException('Record not found');
    }

    return this.prisma.finance.delete({ where: { id } });
  }
}
