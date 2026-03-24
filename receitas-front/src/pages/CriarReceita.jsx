import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/criarReceita.css";
import { criarReceita, getUsuarioLogado } from "../services/api";
import Navbar from "./Navbar";
import { UtensilsCrossed } from "lucide-react";

const CATEGORIAS = ["Brasileira", "Italiana", "Asiática", "Saudável", "Sobremesa"];

export default function CriarReceita() {
  const navigate = useNavigate();
  const inputFotoRef = useRef(null);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Brasileira",
    tempo: "",
    modoPreparo: "",
  });
  const [ingredientes, setIngredientes] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState("");
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
    setErros((prev) => ({ ...prev, foto: "" }));
  };

  const removerFoto = () => {
    setFoto(null);
    setFotoPreview(null);
    inputFotoRef.current.value = "";
  };

  const adicionarIngrediente = () => {
    if (!novoIngrediente.trim()) return;
    setIngredientes((prev) => [...prev, novoIngrediente.trim()]);
    setNovoIngrediente("");
    setErros((prev) => ({ ...prev, ingredientes: "" }));
  };

  const removerIngrediente = (index) => {
    setIngredientes((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublicar = async () => {
    const novosErros = {};
    if (!foto) novosErros.foto = "Adicione uma foto da receita.";
    if (!form.titulo.trim()) novosErros.titulo = "O título é obrigatório.";
    if (!form.tempo.trim()) novosErros.tempo = "Informe o tempo de preparo.";
    if (ingredientes.length === 0) novosErros.ingredientes = "Adicione pelo menos um ingrediente.";
    if (!form.modoPreparo.trim()) novosErros.modoPreparo = "Descreva o modo de preparo.";

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    try {
      const usuario = getUsuarioLogado();
      const formData = new FormData();
      formData.append("usuarioId", usuario.id);
      formData.append("titulo", form.titulo);
      formData.append("descricao", form.descricao);
      formData.append("ingredientes", ingredientes.join(", "));
      formData.append("modoPreparo", form.modoPreparo);
      formData.append("categoria", form.categoria);
      formData.append("tempoPreparo", form.tempo.replace(/\D/g, ""));
      formData.append("imagem", foto);

      await criarReceita(formData);
      alert("Receita publicada com sucesso! 🎉");
      navigate("/home");
    } catch (error) {
      alert("Erro ao publicar receita. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <div className="criar-container">
      <Navbar ativo="adicionar" />

      <div className="criar-body">
       <header className="criar-header">
          <button className="voltar-btn" onClick={() => navigate("/home")}>
            ← Voltar
          </button>
          <h1>Nova Receita</h1>
        </header>

        <div className="criar-card">

          <div className="campo">
            <label>Foto da Receita <span className="obrigatorio">*</span></label>
            {fotoPreview ? (
              <div className="foto-preview-wrap">
                <img src={fotoPreview} alt="Preview" className="foto-preview" />
                <button className="remover-foto-btn" onClick={removerFoto}>
                  ✕ Remover foto
                </button>
              </div>
            ) : (
              <div
                className={`foto-upload-area${erros.foto ? " campo-erro-borda" : ""}`}
                onClick={() => inputFotoRef.current.click()}
              >
                <span className="foto-upload-icon">📷</span>
                <span className="foto-upload-texto">Clique para adicionar uma foto</span>
                <span className="foto-upload-sub">JPG, PNG ou WEBP</span>
              </div>
            )}
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFoto}
            />
            {erros.foto && <span className="campo-erro">{erros.foto}</span>}
          </div>

          <div className="campo">
            <label>Título <span className="obrigatorio">*</span></label>
            <input
              className={`criar-input${erros.titulo ? " campo-erro-borda" : ""}`}
              name="titulo"
              placeholder="Ex: Risoto de Cogumelos"
              value={form.titulo}
              onChange={handleChange}
            />
            {erros.titulo && <span className="campo-erro">{erros.titulo}</span>}
          </div>

          <div className="campo">
            <label>Descrição</label>
            <textarea
              className="criar-textarea"
              name="descricao"
              placeholder="Descreva sua receita..."
              value={form.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="criar-row">
            <div className="campo">
              <label>Categoria</label>
              <select
                className="criar-select"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label>Tempo de Preparo <span className="obrigatorio">*</span></label>
              <input
                className={`criar-input${erros.tempo ? " campo-erro-borda" : ""}`}
                name="tempo"
                placeholder="Ex: 45 min"
                value={form.tempo}
                onChange={handleChange}
              />
              {erros.tempo && <span className="campo-erro">{erros.tempo}</span>}
            </div>
          </div>

          <div className="campo">
            <label>Ingredientes <span className="obrigatorio">*</span></label>
            <div className="ingrediente-row">
              <input
                className={`criar-input${erros.ingredientes ? " campo-erro-borda" : ""}`}
                placeholder="Adicionar ingrediente"
                value={novoIngrediente}
                onChange={(e) => setNovoIngrediente(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && adicionarIngrediente()}
              />
              <button className="add-btn" onClick={adicionarIngrediente}>+</button>
            </div>
            {erros.ingredientes && <span className="campo-erro">{erros.ingredientes}</span>}
            {ingredientes.length > 0 && (
              <ul className="ingredientes-lista">
                {ingredientes.map((ing, i) => (
                  <li key={i}>
                    <span>{ing}</span>
                    <button onClick={() => removerIngrediente(i)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="campo">
            <label>Modo de Preparo <span className="obrigatorio">*</span></label>
            <textarea
              className={`criar-textarea${erros.modoPreparo ? " campo-erro-borda" : ""}`}
              name="modoPreparo"
              placeholder="Descreva o passo a passo..."
              value={form.modoPreparo}
              onChange={handleChange}
            />
            {erros.modoPreparo && <span className="campo-erro">{erros.modoPreparo}</span>}
          </div>

          <button className="publicar-btn" onClick={handlePublicar}>
            Publicar Receita
          </button>

        </div>
      </div>
    </div>
  );
}

