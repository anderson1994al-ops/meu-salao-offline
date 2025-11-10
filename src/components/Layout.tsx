import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrench, Users, Calendar, BarChart3, Settings } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPendingBoletos } = useAppData();

  const navItems = [
    { path: "/servicos", icon: Wrench, label: "Serviços", blocked: true },
    { path: "/clientes", icon: Users, label: "Clientes", blocked: true },
    { path: "/", icon: Calendar, label: "Agenda", blocked: true },
    { path: "/relatorios", icon: BarChart3, label: "Relatório", blocked: true },
    { path: "/configuracoes", icon: Settings, label: "Configurações", blocked: false },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (hasPendingBoletos && item.blocked) {
      toast.error("Você possui boletos pendentes. Por favor, regularize sua situação em Configurações > Planos.");
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-center shadow-md">
        <h1 className="text-lg font-bold uppercase tracking-wide">{title}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 flex items-center justify-around shadow-lg z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isBlocked = hasPendingBoletos && item.blocked;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              disabled={isBlocked}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : isBlocked
                  ? "text-muted-foreground/30 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
