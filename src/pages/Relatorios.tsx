import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Wrench, DollarSign } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppData } from "@/contexts/AppDataContext";
import BlockedAccessDialog from "@/components/BlockedAccessDialog";
import { useExpirationAlert } from "@/hooks/useExpirationAlert";

const Relatorios = () => {
  useExpirationAlert();
  const { clients, services, appointments, hasPendingBoletos, isExpired } = useAppData();
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);

  // Show blocked dialog on mount if expired or pending boletos
  useEffect(() => {
    if (isExpired || hasPendingBoletos) {
      setIsBlockedDialogOpen(true);
    }
  }, [isExpired, hasPendingBoletos]);
  
  // Calcula faturamento por mês dinamicamente
  const monthlyData = React.useMemo(() => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
                    "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push({
        month: months[monthIndex],
        value: 0,
        monthIndex: monthIndex
      });
    }
    
    // Agrupa appointments por mês e soma o faturamento
    appointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      const aptMonth = aptDate.getMonth();
      const monthData = last6Months.find(m => m.monthIndex === aptMonth);
      if (monthData) {
        monthData.value += apt.price;
      }
    });
    
    return last6Months;
  }, [appointments]);

  const totalFaturamento = appointments.reduce((sum, apt) => sum + apt.price, 0);

  const stats = [
    { label: "Clientes", value: clients.length.toString(), icon: Users },
    { label: "Agendamentos", value: appointments.length.toString(), icon: Calendar },
    { label: "Serviços", value: services.length.toString(), icon: Wrench },
    { label: "Faturamento", value: `R$ ${totalFaturamento.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <Layout title="RELATÓRIO">
      <div className="p-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Chart */}
        <Card className="p-3 sm:p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-3">Faturamento Mensal</h3>
          <ChartContainer
            config={{
              value: {
                label: "Faturamento",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-56 sm:h-64 md:h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  tickMargin={8}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `R$${value}`}
                  width={60}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, "Faturamento"]}
                  />} 
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      <BlockedAccessDialog 
        open={isBlockedDialogOpen}
        onOpenChange={setIsBlockedDialogOpen}
        featureName="Relatórios"
        isExpired={isExpired}
      />
    </Layout>
  );
};

export default Relatorios;
