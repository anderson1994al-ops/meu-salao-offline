import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { Wrench, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppData } from "@/contexts/AppDataContext";
import { useNavigate } from "react-router-dom";
import BlockedAccessDialog from "@/components/BlockedAccessDialog";

const Servicos = () => {
  const { services, setServices, hasPendingBoletos } = useAppData();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [newService, setNewService] = useState({ name: "", duration: "", price: "" });

  useEffect(() => {
    if (hasPendingBoletos) {
      setIsBlockedDialogOpen(true);
    }
  }, [hasPendingBoletos]);

  const handleAddService = () => {
    if (!newService.name || !newService.duration || !newService.price) {
      return;
    }

    const service = {
      id: Date.now().toString(),
      name: newService.name,
      duration: parseInt(newService.duration),
      price: parseFloat(newService.price),
    };

    setServices([...services, service]);
    setNewService({ name: "", duration: "", price: "" });
    setIsDialogOpen(false);
  };

  return (
    <Layout title="SERVIÇOS">
      <div className="p-4 space-y-3">
        {services.map((service) => (
          <Card key={service.id} className="p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.duration} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                R$ {service.price.toFixed(2)}
              </span>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

      <BlockedAccessDialog 
        open={isBlockedDialogOpen}
        onOpenChange={setIsBlockedDialogOpen}
        featureName="Serviços"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Ex: Manicure"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                placeholder="Ex: 30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                placeholder="Ex: 50.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddService} className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Servicos;
