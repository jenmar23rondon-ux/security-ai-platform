import { useEffect, useState } from "react";
import { api } from "../api/api";

type AuditLog = {
  id: number;
  action: string;
  entity: string;
  entityId?: number;
  ip?: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
};

export function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.get("/audit").then((res) => setLogs(res.data));
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <div>
          <h1>Auditoria</h1>
          <p>Registro de accesos, cambios de usuarios y eventos administrativos.</p>
        </div>
      </div>
      <section className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Accion</th>
              <th>Entidad</th>
              <th>Fecha</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.user ? `${log.user.name} (${log.user.role})` : "Sistema"}</td>
                <td><span className="pill">{log.action}</span></td>
                <td>{log.entity}{log.entityId ? ` #${log.entityId}` : ""}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.ip ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
