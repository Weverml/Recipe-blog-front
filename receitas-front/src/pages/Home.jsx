import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

const RECEITAS = [
  {
    id: 1,
    titulo: "Risoto de Cogumelos",
    categoria: "Italiana",
    categoriaEmoji: "🍝",
    tempo: "35 min",
    autor: "Chef André",
    autorInicial: "CA",
    avatarCor: "#5C8B3F",
    likes: 42,
    comentarios: 8,
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80",
    salvo: false,
  },
  {
    id: 2,
    titulo: "Açaí com Granola",
    categoria: "Saudável",
    categoriaEmoji: "🥗",
    tempo: "10 min",
    autor: "Patrícia Gomes",
    autorInicial: "PG",
    avatarCor: "#C0583A",
    likes: 89,
    comentarios: 15,
    img: "https://images.unsplash.com/photo-1501746877-14782df58970?auto=format&fit=crop&w=600&q=80",
    salvo: true,
  },
  {
    id: 3,
    titulo: "Tapioca Recheada",
    categoria: "Brasileira",
    categoriaEmoji: "🇧🇷",
    tempo: "20 min",
    autor: "João Costa",
    autorInicial: "JC",
    avatarCor: "#3A6EC0",
    likes: 61,
    comentarios: 11,
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    salvo: false,
  },
  {
    id: 4,
    titulo: "Brigadeiro Gourmet",
    categoria: "Sobremesa",
    categoriaEmoji: "🍫",
    tempo: "45 min",
    autor: "Lucas Silva",
    autorInicial: "LS",
    avatarCor: "#8B5E3C",
    likes: 134,
    comentarios: 27,
    img: "https://images.unsplash.com/photo-1541599468348-e96984315921?auto=format&fit=crop&w=600&q=80",
    salvo: false,
  },
  {
    id: 5,
    titulo: "Sushi Caseiro",
    categoria: "Asiática",
    categoriaEmoji: "🍱",
    tempo: "60 min",
    autor: "Tânia Hashimoto",
    autorInicial: "TH",
    avatarCor: "#7A3AC0",
    likes: 77,
    comentarios: 19,
    img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80",
    salvo: false,
  },
  {
    id: 6,
    titulo: "Pão de Queijo Mineiro",
    categoria: "Brasileira",
    categoriaEmoji: "🇧🇷",
    tempo: "25 min",
    autor: "Chef André",
    autorInicial: "CA",
    avatarCor: "#5C8B3F",
    likes: 203,
    comentarios: 34,
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    salvo: true,
  },
];

const FILTROS = [
  { label: "Todas", emoji: "🍽️" },
  { label: "Brasileira", emoji: "🇧🇷" },
  { label: "Italiana", emoji: "🍝" },
  { label: "Asiática", emoji: "🍱" },
  { label: "Saudável", emoji: "🥗" },
  { label: "Sobremesa", emoji: "🍫" },
];

const CHEFS = [
  { nome: "Chef André", inicial: "CA", cor: "#5C8B3F", receitas: 45 },
  { nome: "Patrícia Gomes", inicial: "PG", cor: "#C0583A", receitas: 32 },
  { nome: "Rafael Dias", inicial: "RD", cor: "#3A8BC0", receitas: 28 },
];

export default function Home() {
  const [filtroAtivo, setFiltroAtivo] = useState("Todas");
  const [receitas, setReceitas] = useState(RECEITAS);
  const [chefseguidos, setChefSeguidos] = useState([]);
  const [navAtivo, setNavAtivo] = useState("home");

  const navigate = useNavigate();

  const toggleLike = (id) => {
    setReceitas((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, curtido: !r.curtido, likes: r.curtido ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  const toggleSalvo = (id) => {
    setReceitas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, salvo: !r.salvo } : r))
    );
  };

  const toggleSeguir = (nome) => {
    setChefSeguidos((prev) =>
      prev.includes(nome) ? prev.filter((n) => n !== nome) : [...prev, nome]
    );
  };

  const receitasFiltradas =
    filtroAtivo === "Todas"
      ? receitas
      : receitas.filter((r) => r.categoria === filtroAtivo);

  const navItems = [
    { id: "home", emoji: "🏠" },
    { id: "notif", emoji: "🔔" },
    { id: "busca", emoji: "🔎" },
    { id: "favoritos", emoji: "❤️" },
    { id: "adicionar", emoji: "➕", action: () => navigate("/criar-receita") },
    { id: "perfil", emoji: "👤" },
    { id: "config", emoji: "⚙️" },
  ];

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="logo-icon">🍽</div>
        <nav className="nav-icons">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn ${navAtivo === item.id ? "nav-ativo" : ""}`}
              onClick={() => {
                setNavAtivo(item.id);
                if (item.action) item.action();
              }}
            >
              {item.emoji}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="main-header">
          <h1 className="titulo-app">Feedeat</h1>
          <p className="subtitulo">Olá! O que vamos cozinhar hoje? 👨‍🍳</p>
        </header>

        <div className="filtros-wrap">
          <div className="filtros">
            {FILTROS.map((f) => (
              <button
                key={f.label}
                className={`filtro-pill${filtroAtivo === f.label ? " ativo" : ""}`}
                onClick={() => setFiltroAtivo(f.label)}
              >
                <span className="filtro-emoji">{f.emoji}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="receitas-grid">
          {receitasFiltradas.length === 0 && (
            <div className="vazio">Nenhuma receita nessa categoria.</div>
          )}
          {receitasFiltradas.map((receita) => (
            <div className="card" key={receita.id}>
              <div className="card-img-wrap">
                <img src={receita.img} alt={receita.titulo} className="card-img" />
                <span className="tempo-badge">⏱ {receita.tempo}</span>
                <span className="categoria-badge">
                  {receita.categoriaEmoji} {receita.categoria}
                </span>
              </div>
              <div className="card-body">
                <div className="card-autor">
                  <div className="avatar" style={{ background: receita.avatarCor }}>
                    {receita.autorInicial}
                  </div>
                  <span className="autor-nome">{receita.autor}</span>
                </div>
                <h3 className="card-titulo">{receita.titulo}</h3>
                <div className="card-acoes">
                  <button
                    className={`like-btn${receita.curtido ? " curtido" : ""}`}
                    onClick={() => toggleLike(receita.id)}
                  >
                    {receita.curtido ? "❤️" : "🤍"} {receita.likes}
                  </button>
                  <span className="comentarios">💬 {receita.comentarios}</span>
                  <button
                    className={`bookmark-btn${receita.salvo ? " salvo" : ""}`}
                    onClick={() => toggleSalvo(receita.id)}
                  >
                    {receita.salvo ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="right-panel">
        <div className="chefs-box">
          <h3 className="chefs-titulo">👨‍🍳 Chefs para Seguir</h3>
          <div className="chefs-lista">
            {CHEFS.map((chef) => {
              const seguindo = chefseguidos.includes(chef.nome);
              return (
                <div className="chef-row" key={chef.nome}>
                  <div className="avatar chef-avatar" style={{ background: chef.cor }}>
                    {chef.inicial}
                  </div>
                  <div className="chef-info">
                    <p className="chef-nome">{chef.nome}</p>
                    <small className="chef-receitas">{chef.receitas} receitas</small>
                  </div>
                  <button
                    className={`seguir-btn${seguindo ? " seguindo" : ""}`}
                    onClick={() => toggleSeguir(chef.nome)}
                  >
                    {seguindo ? "✓ Seguindo" : "Seguir"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stats-box">
          <h3 className="chefs-titulo">📊 Sua Atividade</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-num">12</span>
              <span className="stat-label">Receitas salvas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">5</span>
              <span className="stat-label">Chefs seguidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">3</span>
              <span className="stat-label">Receitas criadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">87</span>
              <span className="stat-label">Curtidas dadas</span>
            </div>
          </div>
        </div>

        <footer className="panel-footer">© 2026 Feedeat</footer>
      </aside>
    </div>
  );
}