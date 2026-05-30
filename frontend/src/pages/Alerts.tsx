import { useEffect, useState } from "react";
import { api } from "../api/api";
import { AlertCard, AlertItem } from "../components/AlertCard";

export function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  async function load() {
    const { data } = await api.get("/alerts");
    setAlerts(data);
  }

  async function resolve(id: number) {
    await api.patch(`/alerts/${id}`, { status: "resuelta" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <h1>Alertas</h1>
      </div>
      <div className="stack">
        {alerts.map((alert) => (
          <div className="alert-row" key={alert.id}>
            <AlertCard alert={alert} />
            {alert.status !== "resuelta" && <button onClick={() => resolve(alert.id)}>Resolver</button>}
          </div>
        ))}
      </div>
    </main>
  );
}

