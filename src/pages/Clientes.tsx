import { useState } from "react";
import Layout from "@/components/Layout";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Client {
  id: string;
  name: string;
  phone: string;
  color: string;
}

const Clientes = () => {
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "Carol", phone: "(00) 00000-0000", color: "bg-green-500" },
    { id: "2", name: "Jennifer", phone: "(99) 99999-9999", color: "bg-red-500" },
    { id: "3", name: "Camila", phone: "(00) 00000-0000", color: "bg-green-500" },
    { id: "4", name: "Isabella", phone: "(00) 00000-0000", color: "bg-green-500" },
    { id: "5", name: "Sophia", phone: "(00) 00000-0000", color: "bg-red-500" },
    { id: "6", name: "Amanda", phone: "(00) 00000-0000", color: "bg-red-500" },
    { id: "7", name: "Charlotte", phone: "(00) 00000-0000", color: "bg-green-500" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "" });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    const colors = ["bg-green-500", "bg-red-500", "bg-blue-500", "bg-purple-500"];
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      phone: newClient.phone,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    setClients([...clients, client]);
    setNewClient({ name: "", phone: "" });
    setIsDialogOpen(false);
    toast.success("Cliente adicionado com sucesso!");
  };

  return (
    <Layout title="CLIENTES">
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Pesquise o nome do cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Client List */}
        <div className="space-y-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className={client.color}>
                  <AvatarFallback className="text-white font-bold">
                    {client.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <p className="text-sm text-primary">{client.phone}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </Card>
          ))}
        </div>
      </div>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nome</Label>
              <Input
                id="client-name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Telefone</Label>
              <Input
                id="client-phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddClient} className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Clientes;
