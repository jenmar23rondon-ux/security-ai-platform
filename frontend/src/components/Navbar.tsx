import { Activity, Bell, LayoutDashboard, LogOut, Shield, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <Shield size={22} />
        Security AI
      </Link>
      <nav className="nav">
        <NavLink to="/" end><LayoutDashboard size={17} />Dashboard</NavLink>
        <NavLink to="/events"><Activity size={17} />Eventos</NavLink>
        <NavLink to="/alerts"><Bell size={17} />Alertas</NavLink>
        <NavLink to="/users"><Users size={17} />Usuarios</NavLink>
      </nav>
      <div className="session">
        <span>{user?.name} ({user?.role})</span>
        <button className="icon-button danger" onClick={logout} title="Cerrar sesion">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

