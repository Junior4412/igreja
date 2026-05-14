import { cn } from "@/lib/utils"
import React from "react"
import { TrendingUp, TrendingDown, DollarSign, Download, Plus, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const FINANCE_TYPES = [
  { value: 'TITHES', label: 'Dízimo' },
  { value: 'OFFERING', label: 'Oferta' },
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'OTHER', label: 'Outro' },
];

const typeLabel = (type: string) => FINANCE_TYPES.find((t) => t.value === type)?.label ?? type;
const isIncome = (type: string) => type === 'TITHES' || type === 'OFFERING';

export default function FinancesPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['finances'],
    queryFn: async () => {
      const res = await api.get('/finances');
      return res.data;
    },
  });

  const { data: summary } = useQuery({
    queryKey: ['finances-summary'],
    queryFn: async () => {
      const res = await api.get('/finances/summary');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/finances', { ...data, amount: parseFloat(data.amount) });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      queryClient.invalidateQueries({ queryKey: ['finances-summary'] });
      toast.success('Transação registrada!');
      setIsModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao registrar transação.'),
  });

  const { register, handleSubmit, reset } = useForm();

  const filtered = transactions.filter((t: any) =>
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    typeLabel(t.type).toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (v: number) =>
    v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'R$ 0,00';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
          <p className="text-muted-foreground">Controle de dízimos, ofertas e despesas.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Entradas</p>
            <h3 className="text-2xl font-bold">{fmt(summary?.totalIncome)}</h3>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Saídas</p>
            <h3 className="text-2xl font-bold">{fmt(summary?.totalExpenses)}</h3>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Líquido</p>
            <h3 className={cn("text-2xl font-bold", (summary?.totalBalance ?? 0) >= 0 ? 'text-green-500' : 'text-red-500')}>
              {fmt(summary?.totalBalance)}
            </h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border shadow-sm">
        <div className="p-6 border-b flex items-center justify-between">
          <h4 className="font-bold">Transações</h4>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-secondary/20">
                  <th className="px-6 py-4 text-sm font-semibold">Data</th>
                  <th className="px-6 py-4 text-sm font-semibold">Descrição</th>
                  <th className="px-6 py-4 text-sm font-semibold">Tipo</th>
                  <th className="px-6 py-4 text-sm font-semibold text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t: any) => (
                    <tr key={t.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 font-medium">{t.description || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          isIncome(t.type) ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                        )}>
                          {typeLabel(t.type)}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold",
                        isIncome(t.type) ? "text-green-500" : "text-red-500"
                      )}>
                        {isIncome(t.type) ? '+' : '-'} {fmt(t.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Nova Transação */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex items-center justify-between bg-secondary/20">
                <h3 className="text-xl font-bold">Nova Transação</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    {...register('type', { required: true })}
                    className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    {FINANCE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <input
                    {...register('amount', { required: true })}
                    type="number"
                    step="0.01"
                    className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="0,00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <input
                    {...register('description')}
                    className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Ex: Dízimo de João Silva"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl border font-medium hover:bg-secondary transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={createMutation.isPending}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg transition-all flex items-center gap-2">
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
