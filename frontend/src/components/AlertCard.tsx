import { AlertTriangle, CheckCircle2 } from "lucide-react";

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  level: "bajo" | "medio" | "alto" | "critico";
  status: "abierta" | "investigando" | "resuelta";
  createdAt: string;
};

export function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <article className={`alert-card ${alert.level}`}>
      <div className="alert-icon">
        {alert.status === "resuelta" ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
      </div>
      <div>
        <div className="row-title">
          <strong>{alert.title}</strong>
          <span className={`pill ${alert.level}`}>{alert.level}</span>
        </div>
        <p>{alert.message}</p>
        <small>{new Date(alert.createdAt).toLocaleString()} · {alert.status}</small>
      </div>
    </article>
  );
}

