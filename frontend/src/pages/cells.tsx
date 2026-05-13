import React from 'react';
import { Search, Plus, Users2, MoreHorizontal, MapPin, User, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../shared/lib/utils';
import api from '../lib/api';

export default function CellsPage() {
  const { data: cells, isLoading, error } = useQuery({
    queryKey: ['cells'],
    queryFn: async () => {
      const response = await api.get('/cells');
      return response.data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Células</h2>
          <p className="text-muted-foreground">Gerencie os grupos e células da igreja.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Nova Célula
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Carregando células...</p>
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-destructive text-center">
          <p className="font-bold">Erro ao carregar dados.</p>
          <p className="text-sm text-muted-foreground">Tente novamente mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cells?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Nenhuma célula cadastrada.
            </div>
          ) : (
            cells?.map((cell: any) => (
              <div key={cell.id} className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all p-6 space-y-4 group">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary transition-colors">
                    <Users2 className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <button className="p-1 hover:bg-secondary rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold">{cell.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {cell.location || 'Local não definido'}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{cell.leader || 'Sem Líder'}</span>
                    </div>
                    <span className="text-muted-foreground">Líder</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Membros</span>
                    <span className="font-semibold">{cell._count?.members || 0}</span>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500">
                      Ativa
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
