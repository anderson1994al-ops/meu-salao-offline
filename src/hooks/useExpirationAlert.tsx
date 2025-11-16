import { useEffect, useState } from "react";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useExpirationAlert = () => {
  const { daysRemaining, isExpired, isTrialPeriod } = useAppData();
  const [hasShownAlert, setHasShownAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset alert when days change
    if (daysRemaining !== null && daysRemaining > 2) {
      setHasShownAlert(false);
    }

    // Show alert when 2 days or less remaining in trial or subscription
    if (daysRemaining !== null && daysRemaining <= 2 && daysRemaining > 0 && !hasShownAlert) {
      setHasShownAlert(true);
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysRemaining);
      
      if (isTrialPeriod) {
        toast.warning(
          `Seu período de teste grátis terminará dia ${expirationDate.toLocaleDateString('pt-BR')}. Ative um plano para continuar usando o app!`,
          {
            duration: 10000,
            action: {
              label: "Ver Planos",
              onClick: () => navigate("/configuracoes/planos"),
            },
          }
        );
      } else {
        toast.warning(
          `Sua mensalidade vencerá dia ${expirationDate.toLocaleDateString('pt-BR')}. Não fique sem os recursos dos planos premium do nosso app!`,
          {
            duration: 10000,
            action: {
              label: "Ver Planos",
              onClick: () => navigate("/configuracoes/planos"),
            },
          }
        );
      }
    }

    // Show alert when expired
    if (isExpired && !hasShownAlert) {
      setHasShownAlert(true);
      toast.error(
        isTrialPeriod 
          ? `Seu período de teste grátis expirou! Pague um boleto para continuar usando o app.`
          : `Seu plano expirou! Pague um boleto para continuar usando todas as funcionalidades.`,
        {
          duration: 10000,
          action: {
            label: "Ver Planos",
            onClick: () => navigate("/configuracoes/planos"),
          },
        }
      );
    }
  }, [daysRemaining, isExpired, isTrialPeriod, hasShownAlert, navigate]);
};
