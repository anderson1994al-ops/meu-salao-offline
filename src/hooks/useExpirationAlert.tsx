import { useEffect, useState } from "react";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useExpirationAlert = () => {
  const { daysRemaining, isExpired } = useAppData();
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset alert when days change
    if (daysRemaining !== null && daysRemaining > 2) {
      setHasShownAlert(false);
    }

    // Show alert when 2 days or less remaining
    if (daysRemaining !== null && daysRemaining <= 2 && daysRemaining > 0 && !hasShownAlert) {
      setHasShownAlert(true);
      
      const renewalDate = new Date();
      renewalDate.setDate(renewalDate.getDate() + daysRemaining);
      
      toast.warning(
        `Sua mensalidade vencerá dia ${renewalDate.toLocaleDateString('pt-BR')}. Não fique sem os recursos dos planos premium do nosso app!`,
        {
          duration: 10000,
          action: {
            label: "Ver Planos",
            onClick: () => navigate("/configuracoes/planos"),
          },
        }
      );
    }

    // Show alert when expired
    if (isExpired && !hasShownAlert) {
      setHasShownAlert(true);
      toast.error(
        `Seu plano expirou! Pague um boleto para continuar usando todas as funcionalidades.`,
        {
          duration: 10000,
          action: {
            label: "Ver Planos",
            onClick: () => navigate("/configuracoes/planos"),
          },
        }
      );
    }
  }, [daysRemaining, isExpired, hasShownAlert, navigate]);
};
