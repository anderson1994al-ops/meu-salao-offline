import { ArrowLeft, RefreshCw, Download, Share2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";

const Sobre = () => {
  const navigate = useNavigate();
  const { settings, exportData } = useAppData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate("/configuracoes")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">SOBRE</h1>
      </header>

      <div className="p-4 space-y-4">
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
            <span className="font-medium text-foreground">1.0.0</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Última atualização:</span>
            <span className="font-medium text-foreground">01/12/2024</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Próxima atualização:</span>
            <span className="font-medium text-orange-500">01/01/2025</span>
          </div>

          <Button variant="outline" className="w-full">
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

        {/* Backup Section */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Backup de Dados</h3>
          <p className="text-sm text-muted-foreground">
            Salve todos os dados do aplicativo (perfil, clientes, serviços, agenda, relatórios e configurações) 
            e compartilhe para outros dispositivos.
          </p>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={exportData}
            >
              <Download className="w-4 h-4 mr-2" />
            </Button>
            <Button 
              variant="default" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={exportData}
            >
              <Share2 className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sobre;
