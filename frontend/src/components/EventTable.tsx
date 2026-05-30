export type EventItem = {
  id: number;
  type: string;
  description: string;
  ip: string;
  country?: string;
  failedAttempts: number;
  requestCount: number;
  createdAt: string;
  riskScore?: {
    score: number;
    level: "bajo" | "medio" | "alto" | "critico";
  };
};

export function EventTable({ events }: { events: EventItem[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>IP</th>
            <th>Pais</th>
            <th>Intentos</th>
            <th>Requests</th>
            <th>Riesgo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.type}</td>
              <td>{event.ip}</td>
              <td>{event.country ?? "N/D"}</td>
              <td>{event.failedAttempts}</td>
              <td>{event.requestCount}</td>
              <td>
                <span className={`pill ${event.riskScore?.level ?? "bajo"}`}>
                  {event.riskScore?.score ?? 0}
                </span>
              </td>
              <td>{new Date(event.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

