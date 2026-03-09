import axios from "axios";

const api = axios.create({
  baseURL: "https://unbequeathable-porter-flaggingly.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const cadastrarUsuario = async (dados) => {
  const response = await api.post("/usuarios", dados);
  return response.data;
};


export const loginUsuario = async (email, senha) => {
  const response = await api.post("/usuarios/login", { email, senha });
  return response.data;
};

export const buscarUsuario = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const atualizarUsuario = async (id, dados) => {
  const response = await api.put(`/usuarios/${id}`, dados);
  return response.data;
};


export const salvarUsuarioLogado = (usuario) => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
};

export const getUsuarioLogado = () => {
  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem("usuario");
};

export const estaLogado = () => {
  return !!localStorage.getItem("usuario");
};

export const criarReceita = async (dados) => {
  const response = await api.post("/receitas", dados, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default api;