import { useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppData } from "@/contexts/AppDataContext";

const Notificacoes = () => {
  const navigate = useNavigate();
  const { settings, setSettings } = useAppData();

  const handleToggle = (checked: boolean) => {
    setSettings({ ...settings, notificationsEnabled: checked });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate("/configuracoes")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">NOTIFICAÇÕES</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 flex-1">
              <Bell className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Lembretes de Agendamentos</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Receba notificações no horário dos atendimentos
                </p>
              </div>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
        </Card>

        <p className="text-sm text-muted-foreground px-1">
          Quando ativado, você receberá uma notificação no topo do celular quando chegar o horário de cada atendimento agendado.
        </p>
      </div>
    </div>
  );
};

export default Notificacoes;
