import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface DashboardChartsProps {
  data: any[];
}

const formatCurrency = (value: number) =>
  value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) ?? 'R$ 0';

export function DashboardCharts({ data }: DashboardChartsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-4">
        <h3 className="text-lg font-bold">Crescimento de Membros</h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMembros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area type="monotone" dataKey="membros" name="Membros"
                stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMembros)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-4">
        <h3 className="text-lg font-bold">Fluxo Financeiro</h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number | string | undefined, name) => [formatCurrency(value), name]}
              />
              <Legend />
              <Line type="monotone" dataKey="receita" name="Receita"
                stroke="hsl(var(--primary))" strokeWidth={3}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="despesa" name="Despesa"
                stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4"
                dot={{ r: 3, fill: '#ef4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
