import { cn } from "@/lib/utils"
import React from "react"
import { UserPlus, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { DashboardCharts } from '../components/dashboard/analytics-charts';
import api from '../lib/api';

const StatCard = ({ label, value, icon: Icon, trend, trendValue, isLoading }: any) => (
  <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
      )}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendValue}%
      </div>
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? (
        <div className="h-8 w-24 bg-secondary animate-pulse rounded-md mt-1" />
      ) : (
        <h3 className="text-2xl font-bold">{value}</h3>
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data;
    },
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da sua igreja este mês.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total de Membros" 
          value={stats?.totalMembers?.toLocaleString() || '0'} 
          icon={Users} 
          trend="up" 
          trendValue="12"
          isLoading={isLoading}
        />
        <StatCard 
          label="Células Ativas" 
          value={stats?.activeCells || '0'} 
          icon={UserPlus} 
          trend="up" 
          trendValue="8"
          isLoading={isLoading}
        />
        <StatCard 
          label="Eventos" 
          value={stats?.upcomingEvents || '0'} 
          icon={Calendar} 
          trend="down" 
          trendValue="2"
          isLoading={isLoading}
        />
        <StatCard 
          label="Receita Mensal" 
          value={stats?.monthlyIncome ? `R$ ${stats.monthlyIncome.toLocaleString()}` : 'R$ 0'} 
          icon={DollarSign} 
          trend="up" 
          trendValue="15"
          isLoading={isLoading}
        />
      </div>

      {!isLoading && stats?.chartData && <DashboardCharts data={stats.chartData} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-3xl border shadow-sm p-6 overflow-hidden">
          <h4 className="font-bold mb-6 text-lg">Distribuição por Célula</h4>
          <div className="space-y-4">
            {['Betel', 'Sião', 'Jerusalém', 'Emanuel'].map((cell, index) => (
              <div key={cell} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{cell}</span>
                  <span>{80 - index * 15}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${80 - index * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border shadow-sm p-6">
          <h4 className="font-bold mb-6 text-lg">Atividades Recentes</h4>
          <div className="space-y-6">
            {[
              { user: 'João Silva', action: 'se tornou membro', time: 'Há 2 horas', place: 'Campus Central' },
              { user: 'Maria Santos', action: 'criou novo evento', time: 'Há 5 horas', place: 'Culto de Jovens' },
              { user: 'Pedro Costa', action: 'registrou dízimo', time: 'Há 1 dia', place: 'Secretaria' },
              { user: 'Ana Oliveira', action: 'atualizou perfil', time: 'Há 2 dias', place: 'Portal' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xs">{item.user.charAt(0)}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    <span className="font-bold">{item.user}</span> {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time} • {item.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
