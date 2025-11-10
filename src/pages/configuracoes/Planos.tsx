import { ArrowLeft, Lock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Planos = () => {
  const navigate = useNavigate();

  const boletos = [
    { month: "Dezembro/2025", dueDate: "05/12/2025", amount: 39.90, status: "pago" },
    { month: "Janeiro/2026", dueDate: "05/01/2026", amount: 39.90, status: "pendente" },
    { month: "Fevereiro/2026", dueDate: "05/02/2026", amount: 39.90, status: "pendente" },
    { month: "Março/2026", dueDate: "05/03/2026", amount: 39.90, status: "pendente" },
    { month: "Abril/2026", dueDate: "05/04/2026", amount: 39.90, status: "pendente" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate("/configuracoes")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">PLANOS</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Current Plan */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Plano Profissional</h2>
            <Badge className="bg-green-500 hover:bg-green-600 text-white">Ativo</Badge>
          </div>
          <p className="text-2xl font-bold text-primary">R$ 39,90<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
        </Card>

        {/* Monthly Tickets */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Boletos Mensais</h3>
          <div className="space-y-3">
            {boletos.map((boleto, index) => (
              <Card key={index} className="p-4">
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
                  disabled={boleto.status === "pago"}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Atualizar Boleto
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planos;
