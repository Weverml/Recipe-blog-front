import { useState } from "react";
import "../style/redefinirSenha.css";
import { Link } from "react-router-dom";

function RedefinirSenha() {
  const [formData, setFormData] = useState({
    novaSenha: "",
    confirmarSenha: "",
  });
  const [errosCampos, setErrosCampos] = useState({});
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errosCampos[name]) {
      setErrosCampos((prev) => ({ ...prev, [name]: false }));
    }
    setErro("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let erros = {};

    if (!formData.novaSenha.trim() || formData.novaSenha.length < 6)
      erros.novaSenha = true;
    if (!formData.confirmarSenha.trim())
      erros.confirmarSenha = true;
    if (formData.novaSenha !== formData.confirmarSenha) {
      erros.novaSenha = true;
      erros.confirmarSenha = true;
      setErro("As senhas não coincidem.");
      setErrosCampos(erros);
      return;
    }

    setErrosCampos(erros);

    if (Object.keys(erros).length > 0) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setSucesso(true);
    setErro("");
    setFormData({ novaSenha: "", confirmarSenha: "" });
    setErrosCampos({});
  };

  return (
    <div className="page">
      <div className="logo-area">
        <h1 className="logo">Feedeat</h1>
        <p className="subtitle">Descubra e compartilhe receitas incríveis</p>
      </div>

      <div className="center">
        <div className="card">
          <h2>Redefinir Senha</h2>
          <p className="descricao">Digite sua nova senha abaixo.</p>

          {!sucesso ? (
            <form onSubmit={handleSubmit}>
              <label>Nova Senha</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                className={errosCampos.novaSenha ? "input-erro" : ""}
              />

              <label>Confirmar Senha</label>
              <input
                type="password"
                placeholder="Repita a nova senha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={errosCampos.confirmarSenha ? "input-erro" : ""}
              />

              {erro && <p className="erro">{erro}</p>}

              <button type="submit">Redefinir Senha</button>
            </form>
          ) : (
            <div className="sucesso-box">
              <p className="sucesso-titulo">Senha redefinida! 🔐</p>
              <p className="sucesso-texto">
                Sua senha foi alterada com sucesso.
              </p>
            </div>
          )}

          <p className="login-link">
            <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        © 2026 Feedeat. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default RedefinirSenha;