import { useLocation, useNavigate } from "react-router-dom";
import { Wrench, Users, Calendar, BarChart3, Settings } from "lucide-react";
import { useAppData } from "@/contexts/AppDataContext";
import { useState } from "react";
import BlockedAccessDialog from "./BlockedAccessDialog";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPendingBoletos, isExpired } = useAppData();
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [blockedFeatureName, setBlockedFeatureName] = useState("");

  const navItems = [
    { path: "/servicos", icon: Wrench, label: "Serviços", blocked: true },
    { path: "/clientes", icon: Users, label: "Clientes", blocked: true },
    { path: "/", icon: Calendar, label: "Agenda", blocked: true },
    { path: "/relatorios", icon: BarChart3, label: "Relatório", blocked: true },
    { path: "/configuracoes", icon: Settings, label: "Configurações", blocked: false },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (hasPendingBoletos && item.blocked) {
      setBlockedFeatureName(item.label);
      setIsBlockedDialogOpen(true);
      return;
    }
    navigate(item.path);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16 flex items-center justify-around shadow-lg z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <BlockedAccessDialog 
        open={isBlockedDialogOpen}
        onOpenChange={setIsBlockedDialogOpen}
        featureName={blockedFeatureName}
        isExpired={isExpired}
      />
    </>
  );
};

export default BottomNavigation;
