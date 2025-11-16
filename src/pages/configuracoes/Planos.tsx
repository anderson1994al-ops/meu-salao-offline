import { ArrowLeft, Lock, Calendar, Clock, AlertCircle } from "lucide-react";
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
  const { boletos, setBoletos, hasPendingBoletos, daysRemaining: contextDaysRemaining, isExpired } = useAppData();
  
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [renewalDate, setRenewalDate] = useState<string>("");
  const [showRenewalAlert, setShowRenewalAlert] = useState(false);

  const ADMIN_EMAIL = "anderson1994.al@gmail.com";
  const ADMIN_PASSWORD = "Jr85025620";

  // Calculate renewal date and show alerts
  useEffect(() => {
    const paidBoletos = boletos.filter(b => b.status === "pago" && b.paymentDate);
    
    if (paidBoletos.length > 0 && contextDaysRemaining !== null) {
      // Get the most recent paid boleto
      const mostRecentPaid = paidBoletos.reduce((latest, current) => {
        const latestDate = new Date(latest.paymentDate!);
        const currentDate = new Date(current.paymentDate!);
        return currentDate > latestDate ? current : latest;
      });

      const paymentDate = new Date(mostRecentPaid.paymentDate!);
      const renewalDate = new Date(paymentDate);
      renewalDate.setDate(renewalDate.getDate() + 30);
      
      setRenewalDate(renewalDate.toLocaleDateString('pt-BR'));
      
      // Show alert if 2 days or less remaining and not already shown
      if (contextDaysRemaining <= 2 && contextDaysRemaining > 0 && !showRenewalAlert) {
        setShowRenewalAlert(true);
        toast.warning(
          `Sua mensalidade vencerá dia ${renewalDate.toLocaleDateString('pt-BR')}. Não fique sem os recursos dos planos premium do nosso app!`,
          { duration: 10000 }
        );
      }

      // Show expiration alert if expired
      if (isExpired && !showRenewalAlert) {
        setShowRenewalAlert(true);
        toast.error(
          `Seu plano expirou! Pague um boleto para continuar usando todas as funcionalidades.`,
          { duration: 10000 }
        );
      }
    }
  }, [boletos, contextDaysRemaining, isExpired]);

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
    
    setBoletos((prevBoletos) => {
      const updatedBoletos = prevBoletos.map((boleto) => {
        if (boleto.id === boletoId) {
          const newStatus = boleto.status === "pago" ? "pendente" : "pago";
          return {
            ...boleto,
            status: newStatus as "pago" | "pendente",
            paymentDate: newStatus === "pago" ? new Date().toISOString() : undefined
          };
        }
        return boleto;
      });
      
      // Check if all boletos are pending (blocks app only if ALL are pending)
      const allPending = updatedBoletos.every(b => b.status === "pendente");
      const statusMessage = !allPending 
        ? "✅ Plano ativo! App liberado (pelo menos um boleto pago)." 
        : "⚠️ Plano pendente! Pague pelo menos um boleto para liberar o app.";
      
      toast.success(statusMessage);
      
      return updatedBoletos;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/configuracoes")}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">PLANOS</h1>
            {contextDaysRemaining !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                isExpired
                  ? 'bg-destructive text-destructive-foreground animate-pulse' 
                  : contextDaysRemaining <= 2 
                  ? 'bg-destructive/20 text-destructive' 
                  : 'bg-primary-foreground/20'
              }`}>
                <Calendar className="w-4 h-4" />
                <span>{isExpired ? 'EXPIRADO' : `${contextDaysRemaining} dias`}</span>
              </div>
            )}
          </div>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{countdown}s</span>
          </div>
        )}
      </header>

      <div className="p-4 space-y-4 pb-20">
        {/* Expiration Alert */}
        {isExpired && (
          <Card className="p-4 bg-destructive border-destructive animate-pulse">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive-foreground mb-1">Plano Expirado!</h3>
                <p className="text-sm text-destructive-foreground">
                  Seu plano expirou. Pague um boleto imediatamente para continuar usando todas as funcionalidades do app!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Renewal Alert */}
        {!isExpired && contextDaysRemaining !== null && contextDaysRemaining <= 2 && (
          <Card className="p-4 bg-destructive/10 border-destructive">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">Renovação Próxima</h3>
                <p className="text-sm text-foreground">
                  Sua mensalidade vencerá dia {renewalDate}. Não fique sem os recursos dos planos premium do nosso app!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Current Plan */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Plano Profissional</h2>
            <Badge className={hasPendingBoletos ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-green-500 hover:bg-green-600 text-white"}>
              {hasPendingBoletos ? (isExpired ? "Expirado" : "Pendente") : "Ativo"}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-primary">R$ 39,90<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
          {contextDaysRemaining !== null && !isExpired && (
            <p className="text-sm text-muted-foreground mt-2">
              Renovação em {contextDaysRemaining} {contextDaysRemaining === 1 ? 'dia' : 'dias'} ({renewalDate})
            </p>
          )}
          {isExpired && (
            <p className="text-sm text-destructive font-semibold mt-2">
              ⚠️ Plano expirado! Pague para reativar.
            </p>
          )}
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
