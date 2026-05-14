import { Plus, Filter, MoreHorizontal, X, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '../lib/api';

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  
  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await api.get('/members');
      return response.data;
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (newMember: any) => {
      const response = await api.post('/members', newMember);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Membro cadastrado com sucesso!');
      setIsModalOpen(false);
      reset();
    },
    onError: () => {
      toast.error('Erro ao cadastrar membro.');
    }
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = (data: any) => {
    createMemberMutation.mutate(data);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membros</h2>
          <p className="text-muted-foreground">Gerencie todos os membros da sua congregação.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Novo Membro
        </button>
      </div>

      {/* Modal de Cadastro */}
      <AnimatePresence>
        {isModalOpen && (
          <>
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
                className="bg-card w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b flex items-center justify-between bg-secondary/20">
                  <h3 className="text-xl font-bold">Cadastrar Novo Membro</h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome Completo</label>
                      <input 
                        {...register('name', { required: true })}
                        className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Ex: João da Silva"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input 
                          {...register('email')}
                          className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="joao@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone</label>
                        <input 
                          {...register('phone')}
                          className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl border font-medium hover:bg-secondary transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || createMemberMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg transition-all flex items-center gap-2"
                    >
                      {isSubmitting || createMemberMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Salvar Membro
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar membros..." 
              className="w-full bg-secondary/50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-secondary transition-colors">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Carregando membros...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-destructive">
              <p className="font-bold">Erro ao carregar dados.</p>
              <p className="text-sm text-muted-foreground">Tente novamente mais tarde.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-secondary/20">
                  <th className="px-6 py-4 text-sm font-semibold">Membro</th>
                  <th className="px-6 py-4 text-sm font-semibold">Célula</th>
                  <th className="px-6 py-4 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum membro encontrado.
                    </td>
                  </tr>
                ) : (
                  members?.map((member: any) => (
                    <tr key={member.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email || 'Sem email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {member.cell?.name || 'Sem Célula'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500">
                          Ativo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          Mostrando {members?.length || 0} membros
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-secondary disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 border rounded hover:bg-secondary disabled:opacity-50">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
