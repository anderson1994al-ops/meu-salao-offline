import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { toast } from "sonner";

const Perfil = () => {
  const navigate = useNavigate();
  const { settings, setSettings } = useAppData();
  const [formData, setFormData] = useState({
    salonName: settings.salonName || "",
    address: settings.address || "",
    phone: settings.phone || "",
  });

  const handleSave = () => {
    setSettings({
      ...settings,
      salonName: formData.salonName,
      address: formData.address,
      phone: formData.phone,
    });
    toast.success("Perfil salvo com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
        <button onClick={() => navigate("/configuracoes")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">PERFIL</h1>
      </header>

      <div className="p-4">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salonName">Nome do Salão</Label>
            <Input
              id="salonName"
              placeholder="Digite o nome do salão"
              value={formData.salonName}
              onChange={(e) => setFormData({ ...formData, salonName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              placeholder="Digite o endereço"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Número</Label>
            <Input
              id="phone"
              placeholder="Digite o número"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Salvar
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
