import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import {
  User,
  Bell,
  CreditCard,
  Info,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const Configuracoes = () => {
  const menuItems = [
    { label: "Perfil", icon: User, color: "text-primary" },
    { label: "Notificações", icon: Bell, color: "text-primary" },
    { label: "Planos", icon: CreditCard, color: "text-primary" },
    { label: "Sobre", icon: Info, color: "text-primary" },
    { label: "Exportar Backup", icon: Download, color: "text-primary" },
    { label: "Importar Backup", icon: Upload, color: "text-primary" },
    { label: "Reset de Dados", icon: RotateCcw, color: "text-destructive" },
  ];

  const handleMenuClick = (label: string) => {
    if (label === "Reset de Dados") {
      toast.error("Funcionalidade de reset não implementada");
    } else if (label === "Exportar Backup") {
      toast.success("Backup exportado com sucesso!");
    } else if (label === "Importar Backup") {
      toast.info("Selecione um arquivo de backup");
    } else {
      toast.info(`${label} - Em desenvolvimento`);
    }
  };

  return (
    <Layout title="CONFIGURAÇÕES">
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors shadow-sm"
              onClick={() => handleMenuClick(item.label)}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <span className={`font-medium ${item.color}`}>{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Configuracoes;
