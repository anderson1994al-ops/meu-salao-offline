import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  color: string;
  notes?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  date: Date;
  time: string;
  client: string;
  service: string;
  price: number;
  status: "scheduled" | "completed" | "canceled";
  notes?: string;
}

export interface Boleto {
  id: number;
  month: string;
  dueDate: string;
  amount: number;
  status: "pago" | "pendente";
  paymentDate?: string;
}

export interface Settings {
  theme: "light" | "dark";
  notifications: boolean;
  autoBackup: boolean;
  notificationsEnabled: boolean;
  salonName: string;
  address: string;
  phone: string;
}

interface AppDataContextType {
  services: Service[];
  setServices: (services: Service[] | ((prev: Service[]) => Service[])) => void;
  clients: Client[];
  setClients: (clients: Client[] | ((prev: Client[]) => Client[])) => void;
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[] | ((prev: Appointment[]) => Appointment[])) => void;
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  boletos: Boleto[];
  setBoletos: (boletos: Boleto[] | ((prev: Boleto[]) => Boleto[])) => void;
  hasPendingBoletos: boolean;
  exportData: () => void;
  importData: (data: string) => void;
  resetData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export { AppDataContext };

const defaultServices: Service[] = [
  { id: "1", name: "Unhas de Gel", duration: 30, price: 50.0 },
  { id: "2", name: "Pés", duration: 30, price: 40.0 },
  { id: "3", name: "Mãos", duration: 30, price: 35.0 },
  { id: "4", name: "Unhas de porcelana", duration: 60, price: 80.0 },
  { id: "5", name: "Francesinha", duration: 45, price: 60.0 },
  { id: "6", name: "Alongamento de unhas", duration: 90, price: 100.0 },
  { id: "7", name: "Cabelo", duration: 60, price: 90.0 },
];

const defaultClients: Client[] = [
  { id: "1", name: "Carol", phone: "(00) 00000-0000", color: "bg-green-500", created_at: new Date().toISOString() },
  { id: "2", name: "Jennifer", phone: "(99) 99999-9999", color: "bg-red-500", created_at: new Date().toISOString() },
  { id: "3", name: "Camila", phone: "(00) 00000-0000", color: "bg-green-500", created_at: new Date().toISOString() },
  { id: "4", name: "Isabella", phone: "(00) 00000-0000", color: "bg-green-500", created_at: new Date().toISOString() },
  { id: "5", name: "Sophia", phone: "(00) 00000-0000", color: "bg-red-500", created_at: new Date().toISOString() },
  { id: "6", name: "Amanda", phone: "(00) 00000-0000", color: "bg-red-500", created_at: new Date().toISOString() },
  { id: "7", name: "Charlotte", phone: "(00) 00000-0000", color: "bg-green-500", created_at: new Date().toISOString() },
];

const defaultSettings: Settings = {
  theme: "light",
  notifications: true,
  autoBackup: false,
  notificationsEnabled: false,
  salonName: "",
  address: "",
  phone: "",
};

const defaultBoletos: Boleto[] = [
  { id: 1, month: "Dezembro/2025", dueDate: "05/12/2025", amount: 39.90, status: "pendente" },
  { id: 2, month: "Janeiro/2026", dueDate: "05/01/2026", amount: 39.90, status: "pendente" },
  { id: 3, month: "Fevereiro/2026", dueDate: "05/02/2026", amount: 39.90, status: "pendente" },
  { id: 4, month: "Março/2026", dueDate: "05/03/2026", amount: 39.90, status: "pendente" },
  { id: 5, month: "Abril/2026", dueDate: "05/04/2026", amount: 39.90, status: "pendente" },
];

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useLocalStorage<Service[]>("gestor_salao_services", defaultServices);
  const [clients, setClients] = useLocalStorage<Client[]>("gestor_salao_clients", defaultClients);
  const [rawAppointments, setRawAppointments] = useLocalStorage<Appointment[]>("gestor_salao_appointments", []);
  const [settings, setSettings] = useLocalStorage<Settings>("gestor_salao_settings", defaultSettings);
  const [boletos, setBoletos] = useLocalStorage<Boleto[]>("gestor_salao_boletos", defaultBoletos);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Convert date strings to Date objects when loading from localStorage
  const appointments = rawAppointments.map(apt => ({
    ...apt,
    date: typeof apt.date === 'string' ? new Date(apt.date) : apt.date
  }));

  const setAppointments = (value: Appointment[] | ((prev: Appointment[]) => Appointment[])) => {
    if (typeof value === 'function') {
      setRawAppointments(prev => {
        const updated = value(prev.map(apt => ({
          ...apt,
          date: typeof apt.date === 'string' ? new Date(apt.date) : apt.date
        })));
        return updated;
      });
    } else {
      setRawAppointments(value);
    }
  };

  const hasPendingBoletos = boletos.every(boleto => boleto.status === "pendente");

  // Auto-save notification (skip on initial load)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      toast.success("💾 Dados salvos automaticamente", {
        duration: 1000,
        position: "bottom-center",
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [services, clients, appointments, settings]);

  const exportData = () => {
    const data = {
      services,
      clients,
      appointments,
      settings,
      exportDate: new Date().toISOString(),
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gestor-salao-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exportado com sucesso!");
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.services) setServices(data.services);
      if (data.clients) setClients(data.clients);
      if (data.appointments) setAppointments(data.appointments);
      if (data.settings) setSettings(data.settings);
      toast.success("Backup importado com sucesso!");
    } catch (error) {
      toast.error("Erro ao importar backup. Arquivo inválido.");
    }
  };

  const resetData = () => {
    setServices(defaultServices);
    setClients(defaultClients);
    setAppointments([]);
    setSettings(defaultSettings);
    toast.success("Dados resetados com sucesso!");
  };

  return (
    <AppDataContext.Provider
      value={{
        services,
        setServices,
        clients,
        setClients,
        appointments,
        setAppointments,
        settings,
        setSettings,
        boletos,
        setBoletos,
        hasPendingBoletos,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
