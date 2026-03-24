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
export const buscarPerfilCompleto = async (id) => {
  const response = await api.get(`/usuarios/${id}/perfil`);
  return response.data;
};

export const atualizarPerfil = async (id, formData) => {
  const response = await api.put(`/usuarios/${id}/perfil`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const listarReceitasUsuario = async (usuarioId) => {
  const response = await api.get(`/receitas/usuario/${usuarioId}`);
  return response.data;
};


export const buscarFeed = async (usuarioId) => {
  const response = await api.get(`/receitas/feed/${usuarioId}`);
  return response.data;
};
export const seguirUsuario = async (seguidorId, seguidoId) => {
  await api.post(`/usuarios/${seguidorId}/seguir/${seguidoId}`);
};

export const deixarDeSeguirUsuario = async (seguidorId, seguidoId) => {
  await api.delete(`/usuarios/${seguidorId}/seguir/${seguidoId}`);
};

export const verificarSeguindo = async (seguidorId, seguidoId) => {
  const response = await api.get(`/usuarios/${seguidorId}/seguindo/${seguidoId}`);
  return response.data; // true | false
};



export const buscarUsuarios = async (termo) => {
  const response = await api.get(`/usuarios/buscar`, { params: { termo } });
  return response.data;
};

export const buscarReceitas = async (termo) => {
  const response = await api.get(`/receitas/buscar`, { params: { termo } });
  return response.data;
};

export default api;