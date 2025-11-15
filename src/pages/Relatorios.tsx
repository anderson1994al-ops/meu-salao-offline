import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Wrench, DollarSign } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppData } from "@/contexts/AppDataContext";

const Relatorios = () => {
  const { clients, services, appointments } = useAppData();
  
  // Calcula faturamento por mês dinamicamente
  const monthlyData = React.useMemo(() => {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
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
        <Card className="p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4">Faturamento Mensal</h3>
          <ChartContainer
            config={{
              value: {
                label: "Faturamento",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  domain={[0, 'auto']}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </Layout>
  );
};

export default Relatorios;
