import { useState } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario, salvarUsuarioLogado } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errosCampos[name]) {
      setErrosCampos((prev) => ({ ...prev, [name]: false }));
    }
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let erros = {};
    if (!formData.email.trim()) erros.email = true;
    if (!formData.senha.trim()) erros.senha = true;
    setErrosCampos(erros);

    if (Object.keys(erros).length > 0) {
      setErro("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);
      const usuario = await loginUsuario(formData.email, formData.senha);
      salvarUsuarioLogado(usuario);
      navigate("/home");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setErro("Senha incorreta.");
          setErrosCampos({ senha: true });
        } else if (err.response.status === 404) {
          setErro("Email não encontrado.");
          setErrosCampos({ email: true });
        } else {
          setErro("Erro ao fazer login. Tente novamente.");
        }
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };

 
  const entrarTeste = () => {
    const usuarioFake = {
      nome: "Usuário Teste",
      email: "teste@feedeat.com"
    };

    salvarUsuarioLogado(usuarioFake);
    navigate("/home");
  };

  return (
    <div className="page">
      <div className="logo-area">
        <h1 className="logo">Feedeat</h1>
        <p className="subtitle">Descubra e compartilhe receitas incríveis</p>
      </div>

      <div className="center">
        <div className="card">
          <h2>Entrar</h2>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errosCampos.email ? "input-erro" : ""}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={errosCampos.senha ? "input-erro" : ""}
            />

            <div className="esqueceu-senha">
              <Link to="/recuperar-senha">Esqueceu a senha?</Link>
            </div>

            <button type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>


          {erro && <p className="erro">{erro}</p>}

          <p className="login-link">
            Não tem conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        © 2026 Feedeat. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default Login;