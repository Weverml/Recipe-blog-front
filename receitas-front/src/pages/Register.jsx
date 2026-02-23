import { useState } from "react";
import "../style/register.css";
import { Link, useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    dataNascimento: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [errosCampos, setErrosCampos] = useState({});
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errosCampos[name]) {
      setErrosCampos((prev) => ({ ...prev, [name]: false }));
    }
    if (erro) setErro("");
    if (sucesso) setSucesso(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let erros = {};
    if (!formData.nome.trim()) erros.nome = true;
    if (!formData.username.trim()) erros.username = true;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) erros.email = true;
    if (!formData.dataNascimento) erros.dataNascimento = true;
    if (!formData.senha.trim() || formData.senha.length < 6) erros.senha = true;

    setErrosCampos(erros);

    if (Object.keys(erros).length > 0) {
      setErro("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuario(formData);
      setSucesso(true);
      setErro("");
      setFormData({ nome: "", username: "", email: "", dataNascimento: "", senha: "" });
      setErrosCampos({});
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSucesso(false);
      if (err.response?.data?.erro) {
        const msgErro = err.response.data.erro;
        if (msgErro.includes("Email")) {
          setErrosCampos({ email: true });
          setErro(msgErro);
        } else if (msgErro.includes("Username")) {
          setErrosCampos({ username: true });
          setErro(msgErro);
        } else {
          setErro(msgErro);
        }
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="page">
      <div className="logo-area">
        <h1 className="logo">Feedeat</h1>
        <p className="subtitle">Descubra e compartilhe receitas incríveis</p>
      </div>

      <div className="center">
        <div className="card">
          <h2>Criar Conta</h2>

          <form onSubmit={handleSubmit}>
            <label>Nome</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errosCampos.nome ? "input-erro" : ""}
            />

            <label>Username</label>
            <input
              type="text"
              placeholder="@seu_usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errosCampos.username ? "input-erro" : ""}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errosCampos.email ? "input-erro" : ""}
            />

            <label>Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              className={errosCampos.dataNascimento ? "input-erro" : ""}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={errosCampos.senha ? "input-erro" : ""}
            />

            <button type="submit" disabled={carregando}>
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {erro && (
            <div style={{ marginTop: "15px" }}>
              <p className="erro">{erro}</p>
            </div>
          )}
          {sucesso && <p className="sucesso">Cadastro realizado com sucesso! Redirecionando...</p>}

          <p className="login-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        © 2026 Feedeat. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default Register;