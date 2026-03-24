import { useState, useEffect, useCallback } from "react";
import { Search, X, Clock, Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../style/buscar.css";
import "../style/perfil.css";
import { buscarUsuarios, buscarReceitas } from "../services/api";

const USUARIOS_MOCK = [
  { id: 1, nome: "Chef André", username: "chefandre", fotoPerfil: null },
  { id: 2, nome: "Patrícia Gomes", username: "patriciag", fotoPerfil: null },
  { id: 3, nome: "Rafael Dias", username: "rafaeldias", fotoPerfil: null },
];

const RECEITAS_MOCK = [
  { id: 1, titulo: "Macarrão à Carbonara", categoria: "Italiana", tempoPreparo: 25, imagemUrl: null },
  { id: 2, titulo: "Frango Grelhado", categoria: "Saudável", tempoPreparo: 30, imagemUrl: null },
  { id: 3, titulo: "Bolo de Chocolate", categoria: "Sobremesa", tempoPreparo: 50, imagemUrl: null },
  { id: 4, titulo: "Moqueca Baiana", categoria: "Brasileira", tempoPreparo: 45, imagemUrl: null },
  { id: 5, titulo: "Temaki de Salmão", categoria: "Asiática", tempoPreparo: 20, imagemUrl: null },
];

export default function Buscar({ termoBusca, setTermoBusca, onFechar }) {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);

  const buscar = useCallback(async (termo) => {
    if (termo.trim() === "") {
      setUsuarios([]);
      setReceitas([]);
      return;
    }
    setCarregando(true);
    try {
      const [dadosUsuarios, dadosReceitas] = await Promise.all([
        buscarUsuarios(termo),
        buscarReceitas(termo),
      ]);
      setUsuarios(dadosUsuarios);
      setReceitas(dadosReceitas);
    } catch (err) {
      console.error(err);
      const t = termo.toLowerCase();
      setUsuarios(USUARIOS_MOCK.filter((u) => u.nome.toLowerCase().includes(t)));
      setReceitas(RECEITAS_MOCK.filter((r) => r.titulo.toLowerCase().includes(t)));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => buscar(termoBusca), 400);
    return () => clearTimeout(timer);
  }, [termoBusca, buscar]);

  const fechar = () => {
    setTermoBusca("");
    onFechar();
  };

  const temResultados = usuarios.length > 0 || receitas.length > 0;

  return (
    <>
      <div className="busca-overlay" onClick={fechar}>
        <div className="busca-painel" onClick={(e) => e.stopPropagation()}>
          <div className="busca-header">
            <h2>Pesquisar</h2>
            <button className="busca-fechar" onClick={fechar}>
              <X size={20} />
            </button>
          </div>

          <div className="busca-input-wrap">
            <Search size={16} color="#aaa" />
            <input
              className="busca-input"
              placeholder="Buscar receitas ou usuários..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              autoFocus
            />
          </div>

          <p className="busca-secao-titulo">
            {termoBusca.trim() === "" ? "DIGITE PARA BUSCAR" : "RESULTADOS"}
          </p>

          {carregando && <p className="busca-vazio">Buscando...</p>}

          {!carregando && termoBusca.trim() !== "" && !temResultados && (
            <p className="busca-vazio">Nenhum resultado encontrado.</p>
          )}

          {!carregando && receitas.length > 0 && (
            <>
              <p className="busca-subsecao">RECEITAS</p>
              <div className="busca-lista">
                {receitas.map((r) => (
                  <div
                    key={r.id}
                    className="busca-receita-row"
                    onClick={() => setReceitaSelecionada(r)}
                  >
                    <div className="busca-receita-img">
                      {r.imagemUrl
                        ? <img src={r.imagemUrl} alt={r.titulo} />
                        : "🍽️"}
                    </div>
                    <div className="busca-info">
                      <p className="busca-nome">{r.titulo}</p>
                      <p className="busca-username">⏱ {r.tempoPreparo} min &nbsp;·&nbsp; {r.categoria}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!carregando && usuarios.length > 0 && (
            <>
              <p className="busca-subsecao">USUÁRIOS</p>
              <div className="busca-lista">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="busca-usuario-row"
                    onClick={() => {
                      navigate(`/perfil/${u.id}`);
                      fechar();
                    }}
                  >
                    <div className="busca-avatar" style={{ background: "#5C8B3F", overflow: "hidden" }}>
                      {u.fotoPerfil
                        ? <img src={u.fotoPerfil} alt={u.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : (u.nome?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="busca-info">
                      <p className="busca-nome">{u.nome}</p>
                      <p className="busca-username">@{u.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {receitaSelecionada && (
        <div className="modal-overlay" onClick={() => setReceitaSelecionada(null)}>
          <div className="modal-detalhe" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" onClick={() => setReceitaSelecionada(null)}>
              <X size={16} />
            </button>
            <div className="modal-info">
              <div className="modal-autor">
                <div className="modal-avatar" style={{ background: "#E8762B" }}>
                  {receitaSelecionada.usuarioFoto
                    ? <img src={receitaSelecionada.usuarioFoto} alt="avatar" />
                    : receitaSelecionada.usuarioNome?.[0]?.toUpperCase() || "?"}
                </div>
                <span
                  style={{ cursor: "pointer", fontWeight: 700 }}
                  onClick={() => { navigate(`/perfil/${receitaSelecionada.usuarioId}`); setReceitaSelecionada(null); fechar(); }}
                >
                  {receitaSelecionada.usuarioNome}
                </span>
                <span className="modal-categoria">{receitaSelecionada.categoria}</span>
              </div>
              <h2 className="modal-titulo">{receitaSelecionada.titulo}</h2>
              <div className="modal-stats">
                <span><Clock size={14} /> {receitaSelecionada.tempoPreparo} min</span>
                <span><Heart size={14} /> {receitaSelecionada.likes ?? 0}</span>
                <span><MessageCircle size={14} /> {receitaSelecionada.comentarios ?? 0}</span>
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
    </>
  );
}


