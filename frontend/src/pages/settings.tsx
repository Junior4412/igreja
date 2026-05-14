import { Settings, Church, Shield, Bell, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as preferências da igreja e do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-1">
          <button className="flex items-center w-full gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <Church className="w-4 h-4" />
            Perfil da Igreja
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary font-medium transition-colors">
            <Shield className="w-4 h-4" />
            Segurança
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary font-medium transition-colors">
            <Bell className="w-4 h-4" />
            Notificações
          </button>
          <button className="flex items-center w-full gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Geral
          </button>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl border shadow-sm p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Perfil da Igreja</h3>
              <p className="text-sm text-muted-foreground">As informações básicas que aparecem nos relatórios e dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Igreja</label>
                <input 
                  type="text" 
                  defaultValue="Igreja Batista Shalom" 
                  className="w-full bg-secondary/50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pastor Responsável</label>
                <input 
                  type="text" 
                  placeholder="Nome do pastor" 
                  className="w-full bg-secondary/50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Endereço</label>
                <input 
                  type="text" 
                  placeholder="Rua, número, bairro..." 
                  className="w-full bg-secondary/50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 shadow-md transition-all">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Identidade Visual</h3>
              <p className="text-sm text-muted-foreground">Personalize as cores e o logo da plataforma.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center shadow-lg border-4 border-card">
                <Church className="w-12 h-12 text-primary-foreground" />
              </div>
              <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-secondary transition-all">
                Alterar Logo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
