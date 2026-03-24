import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, Home as HomeIcon, Bell, Search, Heart, Plus, User, Settings } from "lucide-react";
import Buscar from "./Buscar";

export default function Navbar({ ativo }) {
  const navigate = useNavigate();
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const navItems = [
    { id: "home", icon: <HomeIcon size={22} />, action: () => navigate("/home") },
    { id: "notif", icon: <Bell size={22} /> },
    { id: "busca", icon: <Search size={22} />, action: () => setBuscaAberta(true) },
    { id: "favoritos", icon: <Heart size={22} /> },
    { id: "adicionar", icon: <Plus size={22} />, action: () => navigate("/criar-receita") },
    { id: "perfil", icon: <User size={22} />, action: () => navigate("/perfil") },
    { id: "config", icon: <Settings size={22} /> },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="logo-icon">
            <UtensilsCrossed size={24} color="#E8762B" />
        </div>
        <nav className="nav-icons">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${ativo === item.id ? "nav-ativo" : ""}`}
              onClick={() => {
                if (item.action) item.action();
              }}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </aside>

      {buscaAberta && (
        <Buscar
          termoBusca={termoBusca}
          setTermoBusca={setTermoBusca}
          onFechar={() => setBuscaAberta(false)}
        />
      )}
    </>
  );
}
