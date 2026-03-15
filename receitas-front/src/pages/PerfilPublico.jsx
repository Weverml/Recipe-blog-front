import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Home as HomeIcon, Bell, Search, Heart, Settings,
  LayoutGrid, Plus, X, Clock, MessageCircle, User, UserCheck, UserPlus, Bookmark
} from "lucide-react";
import "../style/perfilPublico.css";

const USUARIOS_MOCK = {
  1: {
    id: 1,
    nome: "Ana Paula",
    username: "@anapaula",
    bio: "Chef amadora | Apaixonada por culinária italiana e doces artesanais 🍝🍰",
    foto: null,
    seguidores: 1240,
    seguindo: 320,
    receitas: [
      {
        id: 1,
        titulo: "Lasanha à Bolonhesa",
        categoria: "Italiana",
        tempo: "90 min",
        likes: 128,
        comentarios: 24,
        descricao: "Uma lasanha clássica com molho bolonhesa rico e bechamel cremoso.",
        ingredientes: ["500g carne moída", "Massa para lasanha", "Molho bechamel", "Queijo parmesão"],
        modoPreparo: ["Prepare o molho bolonhesa", "Faça o bechamel", "Monte as camadas", "Asse por 40 min"],
        img: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 2,
        titulo: "Tiramisu Clássico",
        categoria: "Sobremesa",
        tempo: "30 min",
        likes: 95,
        comentarios: 18,
        descricao: "Tiramisu tradicional italiano com mascarpone e café.",
        ingredientes: ["250g mascarpone", "3 ovos", "Biscoito champagne", "Café forte"],
        modoPreparo: ["Bata as gemas com açúcar", "Misture o mascarpone", "Monte as camadas", "Refrigere por 4h"],
        img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 3,
        titulo: "Risoto de Camarão",
        categoria: "Frutos do Mar",
        tempo: "50 min",
        likes: 210,
        comentarios: 41,
        descricao: "Risoto cremoso com camarões frescos e toque de limão siciliano.",
        ingredientes: ["300g arroz arbório", "400g camarão", "Caldo de peixe", "Limão siciliano"],
        modoPreparo: ["Refogue o camarão", "Prepare o risoto base", "Incorpore o camarão", "Finalize com limão"],
        img: "https://images.unsplash.com/photo-1633436375795-12b3b339a57a?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
};

export default function PerfilPublico() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [navAtivo, setNavAtivo] = useState("busca");
  const [seguindo, setSeguindo] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  const usuario = USUARIOS_MOCK[id] || USUARIOS_MOCK[1];
  const seguidoresCount = seguindo ? usuario.seguidores + 1 : usuario.seguidores;

  const navItems = [
    { id: "home", icon: <HomeIcon size={22} />, action: () => navigate("/home") },
    { id: "notif", icon: <Bell size={22} /> },
    { id: "busca", icon: <Search size={22} /> },
    { id: "favoritos", icon: <Heart size={22} /> },
    { id: "adicionar", icon: <Plus size={22} />, action: () => navigate("/criar-receita") },
    { id: "perfil", icon: <User size={22} />, action: () => navigate("/perfil") },
    { id: "config", icon: <Settings size={22} /> },
  ];

  return (
    <div className="perfil-container">

      <header className="perfil-header">
        <span className="header-logo-text">Feedeat</span>
      </header>

      <div className="perfil-body">

        <aside className="perfil-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-btn ${navAtivo === item.id ? "sidebar-ativo" : ""}`}
                onClick={() => {
                  setNavAtivo(item.id);
                  if (item.action) item.action();
                }}
              >
                {item.icon}
              </button>
            ))}
          </nav>
        </aside>

        <main className="perfil-main">

          <div className="perfil-card">
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">
                {usuario.foto
                  ? <img src={usuario.foto} alt="avatar" />
                  : usuario.nome[0].toUpperCase()
                }
              </div>
            </div>

            <div className="perfil-info">
              <div className="perfil-nome-row">
                <h2>{usuario.nome}</h2>
                <button
                  className={`seguir-btn ${seguindo ? "seguindo" : ""}`}
                  onClick={() => setSeguindo(!seguindo)}
                >
                  {seguindo
                    ? <><UserCheck size={14} /> Seguindo</>
                    : <><UserPlus size={14} /> Seguir</>
                  }
                </button>
              </div>
              <p className="perfil-username">{usuario.username}</p>
              <p className="perfil-bio">{usuario.bio}</p>
              <div className="perfil-stats">
                <div className="stat">
                  <strong>{usuario.receitas.length}</strong>
                  <span>publicações</span>
                </div>
                <div className="stat">
                  <strong>{seguidoresCount}</strong>
                  <span>seguidores</span>
                </div>
                <div className="stat">
                  <strong>{usuario.seguindo}</strong>
                  <span>seguindo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="abas">
            <button className="aba aba-ativa">
              <LayoutGrid size={14} /> PUBLICAÇÕES
            </button>
          </div>

          <div className="fotos-grid">
            {usuario.receitas.map((receita) => (
              <div
                className="foto-item"
                key={receita.id}
                onClick={() => setReceitaSelecionada(receita)}
              >
                <img src={receita.img} alt={receita.titulo} />
                <div className="foto-overlay">
                  <span><Heart size={14} /> {receita.likes}</span>
                  <span><MessageCircle size={14} /> {receita.comentarios}</span>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {receitaSelecionada && (
        <div className="modal-overlay" onClick={() => setReceitaSelecionada(null)}>
          <div className="modal-detalhe" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" onClick={() => setReceitaSelecionada(null)}>
              <X size={16} />
            </button>
            <div className="modal-info">
              <div className="modal-autor">
                <div className="modal-avatar">
                  {usuario.foto ? <img src={usuario.foto} alt="avatar" /> : usuario.nome[0].toUpperCase()}
                </div>
                <span><strong>{usuario.nome}</strong></span>
                <span className="modal-categoria">{receitaSelecionada.categoria}</span>
              </div>
              <h2 className="modal-titulo">{receitaSelecionada.titulo}</h2>
              <div className="modal-stats">
                <span><Clock size={14} /> {receitaSelecionada.tempo}</span>
                <span><Heart size={14} /> {receitaSelecionada.likes}</span>
                <span><MessageCircle size={14} /> {receitaSelecionada.comentarios}</span>
                <span><Bookmark size={14} /></span>
              </div>
              <p className="modal-descricao">{receitaSelecionada.descricao}</p>
              <div className="modal-secao">
                <h3>Ingredientes</h3>
                <ul>
                  {receitaSelecionada.ingredientes.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-secao">
                <h3>Modo de Preparo</h3>
                <ol>
                  {receitaSelecionada.modoPreparo.map((passo, i) => (
                    <li key={i}>{passo}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
