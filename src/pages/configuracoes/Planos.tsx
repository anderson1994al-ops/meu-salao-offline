import { ArrowLeft, Lock, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAppData } from "@/contexts/AppDataContext";
import BottomNavigation from "@/components/BottomNavigation";

const Planos = () => {
  const navigate = useNavigate();
  const { boletos, setBoletos, hasPendingBoletos } = useAppData();
  
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const ADMIN_EMAIL = "anderson1994.al@gmail.com";
  const ADMIN_PASSWORD = "Jr85025620";

  // Countdown timer
  useEffect(() => {
    if (isAuthenticated && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isAuthenticated && countdown === 0) {
      setIsAuthenticated(false);
      setCountdown(30);
      toast.info("Sessão administrativa encerrada");
    }
  }, [isAuthenticated, countdown]);

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdminDialogOpen(false);
      setEmail("");
      setPassword("");
      setCountdown(30);
      toast.success("Login administrativo realizado com sucesso!");
    } else {
      toast.error("Email ou senha incorretos");
    }
  };

  const toggleBoletoStatus = (boletoId: number) => {
    if (!isAuthenticated) {
      setIsAdminDialogOpen(true);
      return;
    }
    
    setBoletos((prev) =>
      prev.map((boleto) =>
        boleto.id === boletoId
          ? { ...boleto, status: boleto.status === "pago" ? "pendente" : "pago" }
          : boleto
      )
    );
    toast.success("Status do boleto atualizado!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/configuracoes")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">PLANOS</h1>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{countdown}s</span>
          </div>
        )}
      </header>

      <div className="p-4 space-y-4 pb-20">
        {/* Current Plan */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Plano Profissional</h2>
            <Badge className={hasPendingBoletos ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-green-500 hover:bg-green-600 text-white"}>
              {hasPendingBoletos ? "Pendente" : "Ativo"}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-primary">R$ 39,90<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
        </Card>

        {/* Monthly Tickets */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Boletos Mensais</h3>
          <div className="space-y-3">
            {boletos.map((boleto) => (
              <Card key={boleto.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {boleto.status === "pago" ? (
                      <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-destructive flex items-center justify-center text-destructive">
                        ✕
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{boleto.month}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>Vencimento: {boleto.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">R$ {boleto.amount.toFixed(2)}</p>
                    <Badge 
                      variant={boleto.status === "pago" ? "default" : "destructive"}
                      className={boleto.status === "pago" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {boleto.status === "pago" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toggleBoletoStatus(boleto.id)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Atualizar Boleto
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Admin Login Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Administrativo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Entrar
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Após o login, você terá 30 segundos para atualizar os boletos.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planos;
