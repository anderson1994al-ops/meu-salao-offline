import { Lock, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BlockedAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  isExpired?: boolean;
}

const BlockedAccessDialog = ({ open, onOpenChange, featureName, isExpired = false }: BlockedAccessDialogProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleViewPlans = () => {
    onOpenChange(false);
    navigate("/configuracoes/planos");
  };

  const handleSignOut = async () => {
    onOpenChange(false);
    try {
      await signOut();
      // Force navigation after signOut completes
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            Recurso Bloqueado
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            A funcionalidade <span className="font-semibold text-foreground">{featureName}</span> está disponível apenas para planos ativos.
          </p>

          <Alert className="bg-orange-50 border-orange-200">
            <CreditCard className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 ml-2">
              <strong className="block mb-1">
                {isExpired ? 'Plano Expirado!' : 'Plano Profissional Pendente'}
              </strong>
              {isExpired 
                ? 'Seu plano de 30 dias expirou. Efetue o pagamento de um boleto para reativar todas as funcionalidades.'
                : 'Efetue o pagamento de pelo menos um boleto mensal para ativar todas as funcionalidades do sistema.'
              }
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleViewPlans}
            className="w-full"
            size="lg"
          >
            Ver Meus Planos
          </Button>

          <Button 
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedAccessDialog;
