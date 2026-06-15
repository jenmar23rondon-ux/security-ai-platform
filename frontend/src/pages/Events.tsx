import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/api";
import { EventItem, EventTable } from "../components/EventTable";

const eventTypes = ["login_failed", "api_abuse", "suspicious_activity", "unknown_ip", "geo_anomaly", "login_success"];

export function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState({
    type: "login_failed",
    description: "Intentos fallidos desde IP desconocida",
    ip: "203.0.113.42",
    country: "Colombia",
    failedAttempts: 12,
    requestCount: 20
  });

  async function load() {
    const { data } = await api.get("/events");
    setEvents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/events", form);
    await load();
  }

  return (
    <main className="page">
      <div className="page-title">
        <h1>Eventos</h1>
      </div>
      <form className="panel form-grid" onSubmit={submit}>
        <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>IP<input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} /></label>
        <label>Pais<input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></label>
        <label>Intentos fallidos<input type="number" value={form.failedAttempts} onChange={(e) => setForm({ ...form, failedAttempts: Number(e.target.value) })} /></label>
        <label>Requests<input type="number" value={form.requestCount} onChange={(e) => setForm({ ...form, requestCount: Number(e.target.value) })} /></label>
        <label className="wide">Descripcion<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <button>Registrar evento</button>
      </form>
      <section className="panel">
        <EventTable events={events} />
      </section>
    </main>
  );
}
