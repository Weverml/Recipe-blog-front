import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LayoutGrid, X, Clock, Heart, MessageCircle, Bookmark,
} from "lucide-react";
import "../style/perfilPublico.css";
import Navbar from "./Navbar";
import {
  buscarPerfilCompleto,
  listarReceitasUsuario,
  seguirUsuario,
  deixarDeSeguirUsuario,
  verificarSeguindo,
  getUsuarioLogado,
} from "../services/api";

export default function PerfilPublico() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [perfil, setPerfil] = useState(null);
  const [receitas, setReceitas] = useState([]);
  const [seguindo, setSeguindo] = useState(false);
  const [loadingSeguir, setLoadingSeguir] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);

  const usuarioLogado = getUsuarioLogado();

  useEffect(() => {
    if (!id) return;

    Promise.all([
      buscarPerfilCompleto(id),
      listarReceitasUsuario(id),
    ])
      .then(async ([dadosPerfil, dadosReceitas]) => {
        setPerfil(dadosPerfil);
        setReceitas(dadosReceitas);

        if (usuarioLogado && usuarioLogado.id !== Number(id)) {
          const estaSeguindo = await verificarSeguindo(usuarioLogado.id, id);
          setSeguindo(estaSeguindo);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSeguir = async () => {
    if (!usuarioLogado) {
      navigate("/login");
      return;
    }
    setLoadingSeguir(true);
    try {
      if (seguindo) {
        await deixarDeSeguirUsuario(usuarioLogado.id, id);
        setPerfil((prev) => ({ ...prev, totalSeguidores: prev.totalSeguidores - 1 }));
      } else {
        await seguirUsuario(usuarioLogado.id, id);
        setPerfil((prev) => ({ ...prev, totalSeguidores: prev.totalSeguidores + 1 }));
      }
      setSeguindo(!seguindo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSeguir(false);
    }
  };

  if (loading) {
    return (
      <div className="perfil-container">
        <header className="perfil-header"><span className="header-logo-text">Feedeat</span></header>
        <div className="perfil-body">
          <Navbar ativo="busca" />
          <main className="perfil-main">
            <p style={{ textAlign: "center", marginTop: 40, color: "#888" }}>Carregando perfil...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="perfil-container">
        <header className="perfil-header"><span className="header-logo-text">Feedeat</span></header>
        <div className="perfil-body">
          <Navbar ativo="busca" />
          <main className="perfil-main">
            <p style={{ textAlign: "center", marginTop: 40, color: "#888" }}>Usuário não encontrado.</p>
          </main>
        </div>
      </div>
    );
  }

  const ehProprioUsuario = usuarioLogado && usuarioLogado.id === Number(id);

  return (
    <div className="perfil-container">
      <header className="perfil-header">
        <span className="header-logo-text">Feedeat</span>
      </header>

      <div className="perfil-body">
        <Navbar ativo="busca" />

        <main className="perfil-main">
          <div className="perfil-card">
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">
                {perfil.fotoPerfil
                  ? <img src={perfil.fotoPerfil} alt="avatar" />
                  : perfil.nome?.[0]?.toUpperCase() || "U"
                }
              </div>
            </div>

            <div className="perfil-info">
              <div className="perfil-nome-row">
                <h2>{perfil.nome}</h2>
                {!ehProprioUsuario && (
                  <button
                    className={`seguir-btn ${seguindo ? "seguindo" : ""}`}
                    onClick={handleSeguir}
                    disabled={loadingSeguir}
                  >
                    {loadingSeguir ? "..." : seguindo ? "✓ Seguindo" : "Seguir"}
                  </button>
                )}
              </div>
              <p className="perfil-username">@{perfil.username}</p>
              <p className="perfil-bio">{perfil.bio}</p>
              <div className="perfil-stats">
                <div className="stat">
                  <strong>{perfil.totalReceitas ?? receitas.length}</strong>
                  <span>publicações</span>
                </div>
                <div className="stat">
                  <strong>{perfil.totalSeguidores ?? 0}</strong>
                  <span>seguidores</span>
                </div>
                <div className="stat">
                  <strong>{perfil.totalSeguindo ?? 0}</strong>
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
            {receitas.length === 0 && (
              <p className="vazio-msg">Nenhuma receita publicada ainda.</p>
            )}
            {receitas.map((receita) => (
              <div
                className="foto-item"
                key={receita.id}
                onClick={() => setReceitaSelecionada(receita)}
              >
                {receita.imagemUrl
                  ? <img src={receita.imagemUrl} alt={receita.titulo} />
                  : <div className="foto-sem-imagem">📷</div>
                }
                <div className="foto-overlay">
                  <span><Heart size={14} /> 0</span>
                  <span><MessageCircle size={14} /> 0</span>
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
                  {perfil.fotoPerfil
                    ? <img src={perfil.fotoPerfil} alt="avatar" />
                    : perfil.nome?.[0]?.toUpperCase() || "U"
                  }
                </div>
                <span><strong>{perfil.nome}</strong></span>
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
      )}
    </div>
  );
}


