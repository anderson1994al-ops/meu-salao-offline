import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Pencil, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { addMonths, subMonths } from "date-fns";
import BlockedAccessDialog from "@/components/BlockedAccessDialog";

const Index = () => {
  const navigate = useNavigate();
  const { appointments, setAppointments, services, settings, hasPendingBoletos, isExpired } = useAppData();

  // Verifica autenticação
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("agenda");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    client: "",
    service: "",
    time: "",
  });

  // Show blocked dialog on mount if pending boletos
  useEffect(() => {
    if (hasPendingBoletos) {
      setIsBlockedDialogOpen(true);
    }
  }, [hasPendingBoletos]);

  const selectedDateAppointments = appointments.filter(
    (apt) => apt.date.toDateString() === date.toDateString()
  );

  const totalAppointments = selectedDateAppointments.length;
  const totalRevenue = selectedDateAppointments.reduce((sum, apt) => sum + apt.price, 0);

  // Horários disponíveis (08:00 - 18:00)
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "12:00", "13:00", "14:00", "15:00", 
    "16:00", "17:00", "18:00"
  ];

  const getTimeSlotStatus = (time: string) => {
    const hasAppointment = selectedDateAppointments.some(apt => apt.time === time);
    return hasAppointment ? "agendado" : "disponivel";
  };

  // Verifica se uma data tem agendamentos
  const hasAppointmentsOnDate = (date: Date) => {
    return appointments.some(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const handleAddAppointment = () => {
    if (!newAppointment.client || !newAppointment.service || !newAppointment.time) {
      return;
    }

    const selectedService = services.find((s) => s.name === newAppointment.service);

    if (editingId) {
      // Editando agendamento existente
      setAppointments(appointments.map(apt => 
        apt.id === editingId 
          ? {
              ...apt,
              client: newAppointment.client,
              service: newAppointment.service,
              time: newAppointment.time,
              price: selectedService?.price || 0,
            }
          : apt
      ));
      setEditingId(null);
    } else {
      // Criando novo agendamento
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
    }
    
    setNewAppointment({ client: "", service: "", time: "" });
    setIsDialogOpen(false);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditingId(appointment.id);
    setNewAppointment({
      client: appointment.client,
      service: appointment.service,
      time: appointment.time,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const handleSendWhatsApp = () => {
    if (!newAppointment.client || !newAppointment.service || !newAppointment.time) {
      return;
    }

    const salonName = settings.salonName || "Nosso Salão";
    const formattedDate = date.toLocaleDateString("pt-BR");
    
    const message = `💗✨ Agendamento Confirmado ✨💗

💋 Salão: ${salonName}
👸 Cliente: ${newAppointment.client}
💆‍♀️ Serviço: ${newAppointment.service}
📅 Data: ${formattedDate}
🕒 Hora: ${newAppointment.time}

Obrigada! Te Aguardamos Ansiosamente! 🌸💄`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Layout title="AGENDAMENTO">
      <div className="p-4">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
          </TabsList>

          {/* Aba Agenda */}
          <TabsContent value="agenda" className="mt-4 space-y-4">
            {/* Navigation and Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-semibold text-foreground">
                  {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={ptBR}
                className="rounded-md border bg-card w-full"
                modifiers={{
                  hasAppointments: (day) => hasAppointmentsOnDate(day)
                }}
                modifiersClassNames={{
                  hasAppointments: "ring-2 ring-yellow-500 ring-inset"
                }}
                classNames={{
                  months: "flex w-full",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-full",
                  day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                }}
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
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
                      className="flex justify-between items-center gap-2 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{apt.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.service} - {apt.time}
                        </p>
                      </div>
                      <p className="font-bold text-primary">R$ {apt.price.toFixed(2)}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditAppointment(apt)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAppointment(apt.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Aba Horários */}
          <TabsContent value="horarios" className="mt-4 space-y-4">
            {/* Navigation and Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="font-semibold text-foreground">
                  {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={ptBR}
                className="rounded-md border bg-card w-full"
                modifiers={{
                  hasAppointments: (day) => hasAppointmentsOnDate(day)
                }}
                modifiersClassNames={{
                  hasAppointments: "ring-2 ring-yellow-500 ring-inset"
                }}
                classNames={{
                  months: "flex w-full",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-full",
                  day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                }}
              />
            </div>

            {/* Time Slots Section */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Horários - {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((time) => {
                  const status = getTimeSlotStatus(time);
                  return (
                    <Button
                      key={time}
                      variant={status === "agendado" ? "default" : "outline"}
                      className={`h-12 ${
                        status === "agendado" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background hover:bg-accent"
                      }`}
                      disabled={status === "agendado"}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold text-foreground text-sm">Legenda:</h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-border bg-background rounded"></div>
                    <span className="text-sm text-muted-foreground">Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-muted-foreground">Indisponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm text-muted-foreground">Agendado</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setEditingId(null);
          setNewAppointment({ client: "", service: "", time: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditingId(null);
              setNewAppointment({ client: "", service: "", time: "" });
            }}>
              Cancelar
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSendWhatsApp}
              disabled={!newAppointment.client || !newAppointment.service || !newAppointment.time}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar WhatsApp
            </Button>
            <Button onClick={handleAddAppointment} className="bg-primary hover:bg-primary/90">
              {editingId ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BlockedAccessDialog 
        open={isBlockedDialogOpen}
        onOpenChange={setIsBlockedDialogOpen}
        featureName="Agenda"
        isExpired={isExpired}
      />
    </Layout>
  );
};

export default Index;
