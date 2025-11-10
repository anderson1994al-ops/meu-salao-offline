import { useState } from "react";
import Layout from "@/components/Layout";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ptBR } from "date-fns/locale";
import { useAppData } from "@/contexts/AppDataContext";

const Index = () => {
  const { appointments, setAppointments, services } = useAppData();
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    client: "",
    service: "",
    time: "",
  });

  const selectedDateAppointments = appointments.filter(
    (apt) => apt.date.toDateString() === date.toDateString()
  );

  const totalAppointments = selectedDateAppointments.length;
  const totalRevenue = selectedDateAppointments.reduce((sum, apt) => sum + apt.price, 0);

  const handleAddAppointment = () => {
    if (!newAppointment.client || !newAppointment.service || !newAppointment.time) {
      return;
    }

    const selectedService = services.find((s) => s.name === newAppointment.service);

    const appointment = {
      id: Date.now().toString(),
      date: date,
      time: newAppointment.time,
      client: newAppointment.client,
      service: newAppointment.service,
      price: selectedService?.price || 0,
      status: "scheduled" as const,
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ client: "", service: "", time: "" });
    setIsDialogOpen(false);
  };

  return (
    <Layout title="AGENDAMENTO">
      <div className="p-4">
        {/* Tabs */}
        <Tabs defaultValue="agenda" className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Calendar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="font-semibold text-foreground">
              {date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </h2>
            <Button variant="ghost" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            locale={ptBR}
            className="rounded-md border bg-card"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
          />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-foreground">{totalAppointments}</p>
            <p className="text-sm text-muted-foreground">Agendamentos</p>
          </Card>
          <Card className="p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-foreground">
              R$ {totalRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Faturamento previsto</p>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="p-6 shadow-sm">
          {selectedDateAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum agendamento para este dia
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-foreground">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.service} - {apt.time}
                    </p>
                  </div>
                  <p className="font-bold text-primary">R$ {apt.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                value={newAppointment.client}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, client: e.target.value })
                }
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Serviço</Label>
              <Select
                value={newAppointment.service}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, service: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({ ...newAppointment, time: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddAppointment} className="bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
