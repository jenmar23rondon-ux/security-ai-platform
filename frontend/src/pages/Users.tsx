import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "User1234", role: "viewer" });

  async function load() {
    const { data } = await api.get("/users");
    setUsers(data);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    await api.post("/users", form);
    setForm({ name: "", email: "", password: "User1234", role: "viewer" });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="page">
      <div className="page-title">
        <h1>Usuarios</h1>
      </div>
      <form className="panel form-grid" onSubmit={submit}>
        <label>Nombre<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Contrasena<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Rol<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>viewer</option><option>analyst</option><option>admin</option></select></label>
        <button>Crear usuario</button>
      </form>
      <section className="panel table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.active ? "Activo" : "Inactivo"}</td></tr>)}</tbody>
        </table>
      </section>
    </main>
  );
}

