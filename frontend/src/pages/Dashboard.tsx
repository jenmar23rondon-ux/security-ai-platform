import { useEffect, useState } from "react";
import { AlertTriangle, ClipboardList, Server, ShieldAlert, Users } from "lucide-react";
import { api } from "../api/api";
import { RiskChart } from "../components/RiskChart";
import { AlertCard, AlertItem } from "../components/AlertCard";
import { EventItem, EventTable } from "../components/EventTable";

type DashboardData = {
  stats: { totalEvents: number; openAlerts: number; criticalAlerts: number; activeUsers: number; auditCount: number };
  recentEvents: EventItem[];
  recentAlerts: AlertItem[];
  suspiciousIps: { ip: string; events: number; failedAttempts: number; requestCount: number; status: string }[];
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
        <Stat icon={<ClipboardList />} label="Registros auditoria" value={data.stats.auditCount} />
      </div>
      <RiskChart risks={data.charts.risks} eventsByType={data.charts.eventsByType} />
      <section className="panel table-wrap section-gap">
        <h3>Actividad sospechosa</h3>
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Intentos fallidos</th>
              <th>Requests</th>
              <th>Eventos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.suspiciousIps.map((item) => (
              <tr key={item.ip}>
                <td>{item.ip}</td>
                <td>{item.failedAttempts}</td>
                <td>{item.requestCount}</td>
                <td>{item.events}</td>
                <td><span className={`pill ${item.status === "Sospechoso" ? "alto" : "medio"}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
