import { Lock, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
}

const BlockedAccessDialog = ({ open, onOpenChange, featureName }: BlockedAccessDialogProps) => {
  const navigate = useNavigate();

  const handleViewPlans = () => {
    onOpenChange(false);
    navigate("/configuracoes/planos");
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
              <strong className="block mb-1">Plano Profissional Pendente</strong>
              Efetue o pagamento de pelo menos um boleto mensal para ativar todas as funcionalidades do sistema.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleViewPlans}
            className="w-full"
            size="lg"
          >
            Ver Meus Planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedAccessDialog;
