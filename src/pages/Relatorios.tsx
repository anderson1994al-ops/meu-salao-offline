import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Users, Calendar, Wrench, DollarSign } from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAppData } from "@/contexts/AppDataContext";
import { useNavigate } from "react-router-dom";

const Relatorios = () => {
  const { clients, services, appointments, hasPendingBoletos } = useAppData();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasPendingBoletos) {
      navigate("/configuracoes/planos");
    }
  }, [hasPendingBoletos, navigate]);
  const data = [
    { month: "Junho", value: 0 },
    { month: "Julho", value: 0 },
    { month: "Agosto", value: 0 },
    { month: "Setembro", value: 0 },
    { month: "Outubro", value: 0 },
    { month: "Novembro", value: 0 },
  ];

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
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  domain={[0, 4]}
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
