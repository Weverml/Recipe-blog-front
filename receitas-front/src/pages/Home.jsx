import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, MessageCircle, ChefHat, BarChart2, X, Clock } from "lucide-react";
import "../style/home.css";
import Navbar from "./Navbar";
import { buscarFeed, getUsuarioLogado } from "../services/api";

const FILTROS = [
  { label: "Todas", emoji: "🍽️" },
  { label: "Brasileira", emoji: "🇧🇷" },
  { label: "Italiana", emoji: "🍝" },
  { label: "Asiática", emoji: "🍱" },
  { label: "Saudável", emoji: "🥗" },
  { label: "Sobremesa", emoji: "🍫" },
];

const CHEFS = [
  { id: 1, nome: "Chef André", inicial: "CA", cor: "#5C8B3F", receitas: 45 },
  { id: 2, nome: "Patrícia Gomes", inicial: "PG", cor: "#C0583A", receitas: 32 },
  { id: 3, nome: "Rafael Dias", inicial: "RD", cor: "#3A8BC0", receitas: 28 },
];

export default function Home() {
  const [filtroAtivo, setFiltroAtivo] = useState("Todas");
  const [receitas, setReceitas] = useState([]);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [chefseguidos, setChefSeguidos] = useState([]);
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

useEffect(() => {
  const usuarioLogado = getUsuarioLogado();
  if (!usuarioLogado) return;
  setUsuario(usuarioLogado);
  buscarFeed(usuarioLogado.id)
    .then(setReceitas)
    .catch(() => {});
}, []);

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

  return (
    <div className="home-container">
      <Navbar ativo="home" />

      <main className="main">
        <header className="main-header">
          <h1 className="titulo-app">Feedeat</h1>
         <p className="subtitulo">Olá, {usuario?.nome}! O que vamos cozinhar hoje? 👨‍🍳</p>
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
            <div
              className="receita-card"
              key={receita.id}
              onClick={() => setReceitaSelecionada(receita)}
              style={{ cursor: "pointer" }}
            >
              <div className="receita-card-img-wrap">
                <img src={receita.imagemUrl} alt={receita.titulo} className="receita-card-img" />
                <span className="tempo-badge">⏱ {receita.tempoPreparo} min</span>
                <span className="categoria-badge">
                  {receita.categoria}
                </span>
              </div>
              <div className="receita-card-body">
                <div
              
  className="receita-card-autor"
        onClick={(e) => { e.stopPropagation(); navigate(`/perfil/${receita.usuarioId}`); }}
        style={{ cursor: "pointer" }}
      >
        <div className="avatar" style={{ background: receita.avatarCor || "#E8762B" }}>
          {receita.usuarioFoto
            ? <img src={receita.usuarioFoto} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            : receita.usuarioNome?.[0]?.toUpperCase()}
        </div>
        <span className="autor-nome">{receita.usuarioNome}</span>
</div>
                <h3 className="receita-card-titulo">{receita.titulo}</h3>
                <div className="receita-card-acoes">
                  <button
                    className={`like-btn${receita.curtido ? " curtido" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggleLike(receita.id); }}
                  >
                    <Heart size={15} fill={receita.curtido ? "#e0345a" : "none"} color={receita.curtido ? "#e0345a" : "#777"} />
                    {receita.likes}
                  </button>
                  <span className="comentarios">
                    <MessageCircle size={15} /> {receita.comentarios}
                  </span>
                  <button
                    className={`bookmark-btn${receita.salvo ? " salvo" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggleSalvo(receita.id); }}
                  >
                    <Bookmark size={16} fill={receita.salvo ? "#E8762B" : "none"} color={receita.salvo ? "#E8762B" : "#aaa"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="right-panel">
        <div className="chefs-box">
          <h3 className="chefs-titulo"><ChefHat size={16} /> Chefs para Seguir</h3>
          <div className="chefs-lista">
            {CHEFS.map((chef) => {
              const seguindo = chefseguidos.includes(chef.nome);
              return (
                <div className="chef-row" key={chef.nome}>
                  <div className="avatar chef-avatar" style={{ background: chef.cor, cursor: "pointer" }} onClick={() => navigate(`/perfil/${chef.id}`)}>
                    {chef.inicial}
                  </div>
                  <div className="chef-info">
                    <p className="chef-nome" onClick={() => navigate(`/perfil/${chef.id}`)} style={{ cursor: "pointer" }}>{chef.nome}</p>
                    <small className="chef-receitas">{chef.receitas} receitas</small>
                  </div>
                  <button className={`seguir-btn${seguindo ? " seguindo" : ""}`} onClick={() => toggleSeguir(chef.nome)}>
                    {seguindo ? "✓ Seguindo" : "Seguir"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stats-box">
          <h3 className="chefs-titulo"><BarChart2 size={16} /> Sua Atividade</h3>
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-num">12</span><span className="stat-label">Receitas salvas</span></div>
            <div className="stat-item"><span className="stat-num">5</span><span className="stat-label">Chefs seguidos</span></div>
            <div className="stat-item"><span className="stat-num">3</span><span className="stat-label">Receitas criadas</span></div>
            <div className="stat-item"><span className="stat-num">87</span><span className="stat-label">Curtidas dadas</span></div>
          </div>
        </div>

        <footer className="panel-footer">© 2026 Feedeat</footer>
      </aside>

      {receitaSelecionada && (
        <div className="modal-overlay" onClick={() => setReceitaSelecionada(null)}>
          <div className="modal-detalhe" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" onClick={() => setReceitaSelecionada(null)}>
              <X size={16} />
            </button>
            <div className="modal-info">
              <div className="modal-autor">
              <div className="modal-avatar" style={{ background: receitaSelecionada.avatarCor }}>
                {receitaSelecionada.usuarioFoto
                  ? <img src={receitaSelecionada.usuarioFoto} alt="avatar" />
                  : receitaSelecionada.usuarioNome?.[0]?.toUpperCase()}
              </div>
                <span
                  style={{ cursor: "pointer", fontWeight: 700 }}
                  onClick={() => { navigate(`/perfil/${receitaSelecionada.autorId}`); setReceitaSelecionada(null); }}
                >
                  {receitaSelecionada.usuarioNome}
                </span>
                <span className="modal-categoria">{receitaSelecionada.categoria}</span>
              </div>
              <h2 className="modal-titulo">{receitaSelecionada.titulo}</h2>
              <div className="modal-stats">
                <span><Clock size={14} /> {receitaSelecionada.tempoPreparo} min</span>
                <span><Heart size={14} /> {receitaSelecionada.likes}</span>
                <span><MessageCircle size={14} /> {receitaSelecionada.comentarios}</span>
                <span><Bookmark size={14} /></span>
              </div>
              <p className="modal-descricao">{receitaSelecionada.descricao}</p>
              <div className="modal-secao">
                <h3>Ingredientes</h3>
                <ul>
                  {receitaSelecionada.ingredientes?.split(",").map((ing, i) => (
                    <li key={i}>{ing.trim()}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-secao">
                <h3>Modo de Preparo</h3>
                <p>{receitaSelecionada.modoPreparo}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
