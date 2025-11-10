import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppData } from "@/contexts/AppDataContext";
import BottomNavigation from "@/components/BottomNavigation";
import { useState } from "react";
import { toast } from "sonner";

const Sobre = () => {
  const navigate = useNavigate();
  const { settings } = useAppData();
  
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [versao, setVersao] = useState("1.0.0");
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState("01/12/2024");
  const [proximaAtualizacao, setProximaAtualizacao] = useState("01/01/2025");

  const ADMIN_EMAIL = "anderson1994.al@gmail.com";
  const ADMIN_PASSWORD = "Jr85025620";

  const handleUpdateSystem = () => {
    setIsAdminDialogOpen(true);
  };

  const handleAdminLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Simulate system update
      const currentDate = new Date().toLocaleDateString("pt-BR");
      setUltimaAtualizacao(currentDate);
      
      // Calculate next update (1 month from now)
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);
      setProximaAtualizacao(nextDate.toLocaleDateString("pt-BR"));
      
      setIsAdminDialogOpen(false);
      setEmail("");
      setPassword("");
      toast.success("Sistema atualizado com sucesso!");
    } else {
      toast.error("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate("/configuracoes")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">SOBRE</h1>
      </header>

      <div className="p-4 space-y-4 pb-20">
        {/* Salon Info */}
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Nome do Salão</p>
            <p className="font-medium text-foreground">
              {settings.salonName || "Não cadastrado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Endereço</p>
            <p className="font-medium text-foreground">
              {settings.address || "Não cadastrado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Número</p>
            <p className="font-medium text-foreground">
              {settings.phone || "Não cadastrado"}
            </p>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Informações do Aplicativo</h3>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Versão atual:</span>
            <span className="font-medium text-foreground">{versao}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Última atualização:</span>
            <span className="font-medium text-foreground">{ultimaAtualizacao}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Próxima atualização:</span>
            <span className="font-medium text-orange-500">{proximaAtualizacao}</span>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleUpdateSystem}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar Sistema (Admin)
          </Button>
        </Card>

        {/* Important Notice */}
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Importante:</strong> O aplicativo é atualizado mensalmente com novas funcionalidades. 
              Caso não seja atualizado, o acesso às áreas de Agenda, Serviços, Clientes e Relatórios será bloqueado.
            </p>
          </div>
        </Card>
      </div>
      
      {/* Admin Login Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Administrativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              />
            </div>
            <Button 
              onClick={handleAdminLogin}
              className="w-full"
            >
              Atualizar Sistema
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Sobre;
