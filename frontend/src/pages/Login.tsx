import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { login, token } = useAuth();
  const [email, setEmail] = useState("admin@security.local");
  const [password, setPassword] = useState("Admin1234");
  const [error, setError] = useState("");

  if (token) return <Navigate to="/" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("No se pudo iniciar sesion");
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <ShieldCheck size={38} />
        <h1>Security AI Platform</h1>
        <p>Centro inteligente de monitoreo y riesgo</p>
        {error && <div className="form-error">{error}</div>}
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Contrasena</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Iniciar sesion</button>
      </form>
    </main>
  );
}

