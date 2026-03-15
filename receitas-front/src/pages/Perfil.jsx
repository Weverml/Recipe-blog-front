import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon, Bell, Search, Bookmark, Settings,
  LayoutGrid, Camera, Pencil, Plus, X, Clock, Heart, MessageCircle, User
} from "lucide-react";
import "../style/perfil.css";
import {
  buscarPerfilCompleto,
  atualizarPerfil,
  listarReceitasUsuario,
  getUsuarioLogado
} from "../services/api";

const RECEITAS_SALVAS = [];

const SEGUIDORES_MOCK = [
  { nome: "Ana Paula", username: "@anapaula", inicial: "A", cor: "#E8762B" },
  { nome: "João Costa", username: "@joaocosta", inicial: "J", cor: "#3A6EC0" },
  { nome: "Patrícia Gomes", username: "@patriciag", inicial: "P", cor: "#C0583A" },
  { nome: "Lucas Silva", username: "@lucassilva", inicial: "L", cor: "#8B5E3C" },
];

const SEGUINDO_MOCK = [
  { nome: "Chef André", username: "@chefandre", inicial: "C", cor: "#5C8B3F" },
  { nome: "Tânia Hashimoto", username: "@taniahashi", inicial: "T", cor: "#7A3AC0" },
  { nome: "Rafael Dias", username: "@rafaeldias", inicial: "R", cor: "#3A8BC0" },
];

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-info">
        <div className="skeleton-line" style={{ width: "70%" }} />
        <div className="skeleton-line" style={{ width: "40%" }} />
      </div>
    </div>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const fileInputPerfilRef = useRef(null);
  const fileInputEditarRef = useRef(null);

  const [abaAtiva, setAbaAtiva] = useState("publicacoes");
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [navAtivo, setNavAtivo] = useState("perfil");
  const [editarAberto, setEditarAberto] = useState(false);
  const [statsModal, setStatsModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState(null);
  const [receitas, setReceitas] = useState([]);
  const [editForm, setEditForm] = useState({
    nome: "",
    bio: "",
    foto: null,
    fotoArquivo: null,
  });

  useEffect(() => {
    const usuario = getUsuarioLogado();
    if (!usuario) {
      navigate("/login");
      return;
    }

    Promise.all([
      buscarPerfilCompleto(usuario.id),
      listarReceitasUsuario(usuario.id),
    ])
      .then(([dadosPerfil, dadosReceitas]) => {
        setPerfil(dadosPerfil);
        setEditForm({
          nome: dadosPerfil.nome || "",
          bio: dadosPerfil.bio || "",
          foto: dadosPerfil.fotoPerfil || null,
          fotoArquivo: null,
        });
        setReceitas(dadosReceitas);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const receitasExibidas = abaAtiva === "publicacoes" ? receitas : RECEITAS_SALVAS;

  const navItems = [
    { id: "home", icon: <HomeIcon size={22} />, action: () => navigate("/home") },
    { id: "notif", icon: <Bell size={22} /> },
    { id: "busca", icon: <Search size={22} /> },
    { id: "favoritos", icon: <Heart size={22} /> },
    { id: "adicionar", icon: <Plus size={22} />, action: () => navigate("/criar-receita") },
    { id: "perfil", icon: <User size={22} />, action: () => navigate("/perfil") },
    { id: "config", icon: <Settings size={22} /> },
  ];

  const abrirEditar = () => {
    setEditForm({
      nome: perfil?.nome || "",
      bio: perfil?.bio || "",
      foto: perfil?.fotoPerfil || null,
      fotoArquivo: null,
    });
    setEditarAberto(true);
  };

  const salvarEditar = async () => {
    const usuario = getUsuarioLogado();
    try {
      const formData = new FormData();
      formData.append("nome", editForm.nome);
      formData.append("bio", editForm.bio);
      if (editForm.fotoArquivo) {
        formData.append("foto", editForm.fotoArquivo);
      }
      const atualizado = await atualizarPerfil(usuario.id, formData);
      setPerfil((prev) => ({ ...prev, ...atualizado }));
      setEditarAberto(false);
    } catch (error) {
      alert("Erro ao salvar perfil. Tente novamente.");
      console.error(error);
    }
  };


  const handleFotoPerfilChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const usuario = getUsuarioLogado();
    try {
      const formData = new FormData();
      formData.append("foto", file);
      const atualizado = await atualizarPerfil(usuario.id, formData);
      setPerfil((prev) => ({ ...prev, fotoPerfil: atualizado.fotoPerfil }));
    } catch (error) {
      alert("Erro ao atualizar foto.");
      console.error(error);
    }
  };

  const handleFotoEditarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditForm((prev) => ({
      ...prev,
      foto: URL.createObjectURL(file),
      fotoArquivo: file,
    }));
  };

  const statsModalData = statsModal === "seguidores" ? SEGUIDORES_MOCK : SEGUINDO_MOCK;
  const statsModalTitulo = statsModal === "seguidores" ? "Seguidores" : "Seguindo";

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
                onClick={() => { setNavAtivo(item.id); if (item.action) item.action(); }}
              >
                {item.icon}
              </button>
            ))}
          </nav>
        </aside>

        <main className="perfil-main">
          <div className="perfil-card">
            <div className="perfil-avatar-wrap" onClick={() => fileInputPerfilRef.current.click()}>
              <div className="avatar-ring">
                <div className="perfil-avatar">
                  
                  {perfil?.fotoPerfil
                    ? <img src={perfil.fotoPerfil} alt="avatar" />
                    : perfil?.nome?.[0]?.toUpperCase() || "U"}
                </div>
              </div>
              <button className="avatar-cam" onClick={(e) => { e.stopPropagation(); fileInputPerfilRef.current.click(); }}>
                <Camera size={14} color="#3a3a3a" strokeWidth={2} />
              </button>
              <input ref={fileInputPerfilRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFotoPerfilChange} />
            </div>

            <div className="perfil-info">
              <div className="perfil-nome-row">
                <h2>{perfil?.nome || "Carregando..."}</h2>
                <button className="editar-btn" onClick={abrirEditar}><Pencil size={13} /> Editar perfil</button>
                <button className="nova-receita-btn" onClick={() => navigate("/criar-receita")}><Plus size={14} /> Nova Receita</button>
              </div>
              <p className="perfil-username">@{perfil?.username || ""}</p>
              <p className="perfil-bio">{perfil?.bio || ""}</p>
              <div className="perfil-stats">
                <div className="stat">
                  <strong>{perfil?.totalReceitas ?? 0}</strong>
                  <span>publicações</span>
                </div>
                <div className="stat stat-clicavel" onClick={() => setStatsModal("seguidores")}>
                  <strong>248</strong>
                  <span>seguidores</span>
                </div>
                <div className="stat stat-clicavel" onClick={() => setStatsModal("seguindo")}>
                  <strong>89</strong>
                  <span>seguindo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="abas">
            <button className={`aba ${abaAtiva === "publicacoes" ? "aba-ativa" : ""}`} onClick={() => setAbaAtiva("publicacoes")}>
              <LayoutGrid size={14} /> PUBLICAÇÕES
            </button>
            <button className={`aba ${abaAtiva === "salvos" ? "aba-ativa" : ""}`} onClick={() => setAbaAtiva("salvos")}>
              <Bookmark size={14} /> SALVOS
            </button>
          </div>

          <div className="fotos-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                {receitasExibidas.length === 0 && <p className="vazio-msg">Nenhuma receita aqui ainda.</p>}
                {receitasExibidas.map((receita) => (
                  <div className="foto-item" key={receita.id} onClick={() => setReceitaSelecionada(receita)}>
                  
                    {receita.imagemUrl
                      ? <img src={receita.imagemUrl} alt={receita.titulo} />
                      : <div className="foto-sem-imagem">📷</div>
                    }
                    <div className="foto-overlay">
                      <span><Heart size={14} /> 0</span>
                      <span><MessageCircle size={14} /> 0</span>
                    </div>
                    <div className="foto-titulo">
                      <span className="foto-categoria">{receita.categoria}</span>
                      <span className="foto-nome">{receita.titulo}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </main>
      </div>

      
      {statsModal && (
        <div className="modal-overlay" onClick={() => setStatsModal(null)}>
          <div className="modal-stats-lista" onClick={(e) => e.stopPropagation()}>
            <div className="modal-stats-header">
              <h3>{statsModalTitulo}</h3>
              <button className="modal-fechar-editar" onClick={() => setStatsModal(null)}><X size={18} /></button>
            </div>
            <div className="stats-usuarios-lista">
              {statsModalData.map((u, i) => (
                <div className="stats-usuario-row" key={i}>
                  <div className="stats-usuario-avatar" style={{ background: u.cor }}>{u.inicial}</div>
                  <div>
                    <p className="stats-usuario-nome">{u.nome}</p>
                    <p className="stats-usuario-username">{u.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    
      {receitaSelecionada && (
        <div className="modal-overlay" onClick={() => setReceitaSelecionada(null)}>
          <div className="modal-detalhe" onClick={(e) => e.stopPropagation()}>
            <div className="modal-detalhe-scroll">
              <div className="modal-info">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "-8px" }}>
                  <button className="modal-fechar" onClick={() => setReceitaSelecionada(null)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="modal-autor">
                  <div className="modal-avatar">
                    {perfil?.fotoPerfil ? <img src={perfil.fotoPerfil} alt="avatar" /> : "U"}
                  </div>
                  <span><strong>Você</strong></span>
                  <span className="modal-categoria">{receitaSelecionada.categoria}</span>
                </div>
                <h2 className="modal-titulo">{receitaSelecionada.titulo}</h2>
                <div className="modal-stats">
                  <span><Clock size={14} /> {receitaSelecionada.tempoPreparo} min</span>
                  <span><Heart size={14} /> 0</span>
                  <span><MessageCircle size={14} /> 0</span>
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
        </div>
      )}

    
      {editarAberto && (
        <div className="modal-overlay" onClick={() => setEditarAberto(false)}>
          <div className="modal-editar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-editar-header">
              <h2>Editar Perfil</h2>
              <button className="modal-fechar-editar" onClick={() => setEditarAberto(false)}><X size={18} /></button>
            </div>
            <div className="editar-avatar-wrap">
              <div className="editar-avatar">
                {editForm.foto
                  ? <img src={editForm.foto} alt="avatar" />
                  : <span style={{ fontSize: 32 }}>👤</span>}
              </div>
              <button className="editar-avatar-cam" onClick={() => fileInputEditarRef.current.click()}>
                <Camera size={14} color="#3a3a3a" strokeWidth={2} />
              </button>
              <input ref={fileInputEditarRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFotoEditarChange} />
            </div>
            <div className="editar-campo">
              <label>Nome</label>
              <input value={editForm.nome} onChange={(e) => setEditForm((p) => ({ ...p, nome: e.target.value }))} />
            </div>
            <div className="editar-campo">
              <label>Bio</label>
              <textarea value={editForm.bio} onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))} />
            </div>
            <button className="salvar-perfil-btn" onClick={salvarEditar}>Salvar</button>
          </div>
        </div>
      )}

    </div>
  );
}