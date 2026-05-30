import { useEffect, useState } from "react";
import { AlertTriangle, Server, ShieldAlert, Users } from "lucide-react";
import { api } from "../api/api";
import { RiskChart } from "../components/RiskChart";
import { AlertCard, AlertItem } from "../components/AlertCard";
import { EventItem, EventTable } from "../components/EventTable";

type DashboardData = {
  stats: { totalEvents: number; openAlerts: number; criticalAlerts: number; activeUsers: number };
  recentEvents: EventItem[];
  recentAlerts: AlertItem[];
  charts: { risks: { name: string; value: number }[]; eventsByType: { name: string; value: number }[] };
};

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="page"><p>Cargando dashboard...</p></div>;

  return (
    <main className="page">
      <div className="page-title">
        <div>
          <h1>Centro de seguridad</h1>
          <p>Monitoreo inteligente de actividad, riesgo y alertas.</p>
        </div>
      </div>
      <div className="stats-grid">
        <Stat icon={<Server />} label="Eventos" value={data.stats.totalEvents} />
        <Stat icon={<AlertTriangle />} label="Alertas abiertas" value={data.stats.openAlerts} />
        <Stat icon={<ShieldAlert />} label="Criticas/altas" value={data.stats.criticalAlerts} />
        <Stat icon={<Users />} label="Usuarios activos" value={data.stats.activeUsers} />
      </div>
      <RiskChart risks={data.charts.risks} eventsByType={data.charts.eventsByType} />
      <section className="split-grid">
        <div className="panel">
          <h3>Eventos recientes</h3>
          <EventTable events={data.recentEvents} />
        </div>
        <div className="panel">
          <h3>Alertas recientes</h3>
          <div className="stack">
            {data.recentAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: JSX.Element; label: string; value: number }) {
  return (
    <section className="stat-card">
      {icon}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </section>
  );
}

