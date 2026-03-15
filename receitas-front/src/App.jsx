import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import CriarReceita from "./pages/CriarReceita";
import Perfil from "./pages/Perfil";
import PerfilPublico from "./pages/PerfilPublico";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinirSenha" element={<RedefinirSenha />} />
        <Route path="/home" element={<Home />} />
        <Route path="/criar-receita" element={<CriarReceita />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/:id" element={<PerfilPublico />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;