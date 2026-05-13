import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(churchId: string) {
    if (!churchId) {
      return {
        totalMembers: 0, activeCells: 0, upcomingEvents: 0,
        monthlyIncome: 0, chartData: [],
      };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [membersCount, cellsCount, eventsCount, monthlyFinances, allFinances] = await Promise.all([
      this.prisma.member.count({ where: { churchId } }),
      this.prisma.cell.count({ where: { churchId } }),
      this.prisma.event.count({ where: { churchId, date: { gte: now } } }),
      this.prisma.finance.findMany({
        where: { churchId, date: { gte: startOfMonth } },
      }),
      this.prisma.finance.findMany({
        where: { churchId, date: { gte: sixMonthsAgo } },
        orderBy: { date: 'asc' },
      }),
    ]);

    const monthlyIncome = monthlyFinances
      .filter((f) => f.type === 'TITHES' || f.type === 'OFFERING')
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Gráfico: agrupa por mês os últimos 6 meses
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const monthFinances = allFinances.filter((f) => {
        const d = new Date(f.date);
        return d >= month && d < nextMonth;
      });

      const receita = monthFinances
        .filter((f) => f.type === 'TITHES' || f.type === 'OFFERING')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const despesa = monthFinances
        .filter((f) => f.type === 'EXPENSE')
        .reduce((acc, curr) => acc + curr.amount, 0);

      chartData.push({
        name: monthNames[month.getMonth()],
        membros: membersCount, // simplificação: mostra total atual
        receita: Math.round(receita),
        despesa: Math.round(despesa),
      });
    }

    return {
      totalMembers: membersCount,
      activeCells: cellsCount,
      upcomingEvents: eventsCount,
      monthlyIncome: Math.round(monthlyIncome),
      chartData,
    };
  }
}
