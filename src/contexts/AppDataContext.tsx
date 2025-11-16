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
  daysRemaining: number | null;
  isExpired: boolean;
  isTrialPeriod: boolean;
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
  const [registrationDate] = useLocalStorage<string>("gestor_salao_registration_date", new Date().toISOString());

  // Initialize boletos with automatic dates based on registration date
  useEffect(() => {
    const initializeBoletos = () => {
      const regDate = new Date(registrationDate);
      const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];

      const newBoletos = Array.from({ length: 5 }, (_, index) => {
        const dueDate = new Date(regDate);
        dueDate.setMonth(dueDate.getMonth() + index);
        
        const month = monthNames[dueDate.getMonth()];
        const year = dueDate.getFullYear();
        
        return {
          id: index + 1,
          month: `${month}/${year}`,
          dueDate: dueDate.toLocaleDateString('pt-BR'),
          amount: 39.90,
          status: "pendente" as const,
        };
      });

      // Only update if boletos are default (check if dates match default)
      const isDefault = boletos.length === 5 && 
        boletos[0].dueDate === "05/12/2025";
      
      if (isDefault) {
        setBoletos(newBoletos);
      }
    };

    initializeBoletos();
  }, []);

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

  // Calculate days remaining and expiration status with 7-day trial
  const calculatePlanStatus = () => {
    const paidBoletos = boletos.filter(b => b.status === "pago" && b.paymentDate);
    const regDate = new Date(registrationDate);
    const today = new Date();
    
    // Calculate trial period (7 days from registration)
    const trialEndDate = new Date(regDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    const trialDiffTime = trialEndDate.getTime() - today.getTime();
    const trialDaysRemaining = Math.ceil(trialDiffTime / (1000 * 60 * 60 * 24));
    const isInTrialPeriod = trialDaysRemaining > 0;
    
    console.log("Data de registro:", regDate);
    console.log("Fim do período de teste:", trialEndDate);
    console.log("Dias restantes do teste:", trialDaysRemaining);
    console.log("Está no período de teste:", isInTrialPeriod);
    
    // If still in trial period and no payments made
    if (isInTrialPeriod && paidBoletos.length === 0) {
      return { 
        daysRemaining: trialDaysRemaining, 
        isExpired: false,
        isTrialPeriod: true
      };
    }
    
    // If trial ended and no payments made
    if (!isInTrialPeriod && paidBoletos.length === 0) {
      return { 
        daysRemaining: 0, 
        isExpired: true,
        isTrialPeriod: false
      };
    }

    // If there are paid boletos, calculate based on most recent payment
    const mostRecentPaid = paidBoletos.reduce((latest, current) => {
      const latestDate = new Date(latest.paymentDate!);
      const currentDate = new Date(current.paymentDate!);
      return currentDate > latestDate ? current : latest;
    });

    console.log("Boleto mais recente:", mostRecentPaid);

    const paymentDate = new Date(mostRecentPaid.paymentDate!);
    const renewalDate = new Date(paymentDate);
    renewalDate.setDate(renewalDate.getDate() + 30);
    
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log("Data de pagamento:", paymentDate);
    console.log("Data de renovação:", renewalDate);
    console.log("Dias restantes:", diffDays);
    
    return {
      daysRemaining: diffDays > 0 ? diffDays : 0,
      isExpired: diffDays <= 0,
      isTrialPeriod: false
    };
  };

  const { daysRemaining, isExpired, isTrialPeriod } = calculatePlanStatus();

  // Check if app should be blocked: all boletos pending OR plan expired
  const hasPendingBoletos = boletos.every(boleto => boleto.status === "pendente") || isExpired;

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
        daysRemaining,
        isExpired,
        isTrialPeriod,
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
