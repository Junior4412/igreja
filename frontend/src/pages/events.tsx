import { Calendar as Plus, MapPin, Clock, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function EventsPage() {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events');
      return response.data;
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return {
      dayName: days[date.getDay()],
      dayNumber: date.getDate().toString().padStart(2, '0'),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground">Agenda completa de atividades e cultos.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-sm transition-all active:scale-95">
          <Plus className="w-4 h-4" />
          Novo Evento
        </button>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Carregando agenda...</p>
        </div>
      ) : error ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-destructive text-center">
          <p className="font-bold">Erro ao carregar dados.</p>
          <p className="text-sm text-muted-foreground">Tente novamente mais tarde.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border shadow-sm divide-y">
          {events?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Nenhum evento agendado.
            </div>
          ) : (
            events?.map((event: any) => {
              const { dayName, dayNumber, time } = formatDate(event.date);
              return (
                <div key={event.id} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-secondary/5 transition-colors group">
                  <div className="flex-shrink-0 w-24 h-24 bg-primary/5 rounded-2xl flex flex-col items-center justify-center border-2 border-primary/10 group-hover:border-primary transition-colors">
                    <span className="text-sm font-bold text-primary uppercase">{dayName}</span>
                    <span className="text-2xl font-black text-primary">{dayNumber}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground border">
                        ATIVIDADE
                      </span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {event.location || 'Templo Sede'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-secondary transition-colors">
                      Detalhes
                    </button>
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
