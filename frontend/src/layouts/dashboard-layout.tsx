import { cn } from "@/lib/utils"
import React from "react"
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Settings, 
  LogOut,
  ChevronRight,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const SidebarItem = ({ icon: Icon, label, to }: SidebarItemProps) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link to={to} className={cn(
      "flex items-center w-full gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
      active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
      {active && <ChevronRight className="ml-auto w-4 h-4" />}
    </Link>
  );
};

const StarOfDavid = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L18.5 13H5.5L12 2Z" />
    <path d="M12 22L5.5 11H18.5L12 22Z" fillOpacity="0.8" />
  </svg>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col p-4">
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
            <StarOfDavid className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">Igreja Batista</span>
            <span className="text-xl font-black tracking-tighter text-primary">Shalom</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={Users} label="Membros" to="/members" />
          <SidebarItem icon={Users2} label="Células" to="/cells" />
          <SidebarItem icon={Calendar} label="Eventos" to="/events" />
          <SidebarItem icon={DollarSign} label="Financeiro" to="/finances" />
          <div className="pt-4 mt-4 border-t space-y-2">
            <SidebarItem icon={Settings} label="Configurações" to="/settings" />
          </div>
        </nav>

        <div className="pt-4 border-t">
          <button className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors group">
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="w-full bg-secondary/50 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 border shadow-sm cursor-pointer hover:opacity-80 transition-opacity" />
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-secondary/20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
