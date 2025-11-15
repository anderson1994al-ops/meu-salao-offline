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
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "@/contexts/AppDataContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Configuracoes = () => {
  const navigate = useNavigate();
  const { exportData, importData, resetData, hasPendingBoletos } = useAppData();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const menuItems = [
    { label: "Perfil", icon: User, color: "text-primary", route: "/configuracoes/perfil" },
    { label: "Notificações", icon: Bell, color: "text-primary", route: "/configuracoes/notificacoes" },
    { label: "Planos", icon: CreditCard, color: "text-primary", route: "/configuracoes/planos" },
    { label: "Sobre", icon: Info, color: "text-primary", route: "/configuracoes/sobre" },
    { label: "Exportar Backup", icon: Download, color: "text-primary" },
    { label: "Importar Backup", icon: Upload, color: "text-primary" },
    { label: "Reset de Dados", icon: RotateCcw, color: "text-destructive" },
    { label: "Sair da Conta", icon: LogOut, color: "text-destructive" },
  ];

  // Filter menu items based on payment status
  const filteredMenuItems = hasPendingBoletos 
    ? menuItems.filter(item => item.label === "Planos" || item.label === "Sobre")
    : menuItems;

  const handleMenuClick = (label: string, route?: string) => {
    if (route) {
      navigate(route);
    } else if (label === "Reset de Dados") {
      setShowResetDialog(true);
    } else if (label === "Exportar Backup") {
      exportData();
    } else if (label === "Importar Backup") {
      fileInputRef.current?.click();
    } else if (label === "Sair da Conta") {
      navigate("/login");
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleResetConfirm = () => {
    resetData();
    setShowResetDialog(false);
  };

  return (
    <Layout title="CONFIGURAÇÕES">
      <div className="p-4 space-y-3">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors shadow-sm"
              onClick={() => handleMenuClick(item.label, item.route)}
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

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resetar todos os dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá apagar permanentemente todos os dados do aplicativo,
              incluindo clientes, serviços e agendamentos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm} className="bg-destructive hover:bg-destructive/90">
              Resetar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Configuracoes;
