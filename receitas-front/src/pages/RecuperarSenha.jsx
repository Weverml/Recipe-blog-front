import { useState } from "react";
import "../style/recuperarSenha.css";
import { Link } from "react-router-dom";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErro("Digite um email válido.");
      return;
    }

    setErro("");
    setEnviado(true);
  };

  return (
    <div className="page">
      <div className="logo-area">
        <h1 className="logo">Feedeat</h1>
        <p className="subtitle">Descubra e compartilhe receitas incríveis</p>
      </div>

      <div className="center">
        <div className="card">
          <h2>Recuperar Senha</h2>
          <p className="descricao">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

          {!enviado ? (
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErro("");
                }}
                className={erro ? "input-erro" : ""}
              />

              {erro && <p className="erro">{erro}</p>}

              <button type="submit">Enviar link de recuperação</button>
            </form>
          ) : (
            <div className="sucesso-box">
              <p className="sucesso-titulo">Email enviado! 📤</p>
              <p className="sucesso-texto">
                Verifique sua caixa de entrada para redefinir sua senha.
              </p>
                {/* botão temporário para testar o fluxo */}
                <Link to="/redefinirSenha">
                <button style={{ marginTop: "15px" }}>Redefinir senha</button>
                </Link>
            </div>
            )}

          <p className="login-link">
            Lembrou a senha? <Link to="/login">Voltar ao login</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        © 2026 Feedeat. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default RecuperarSenha;