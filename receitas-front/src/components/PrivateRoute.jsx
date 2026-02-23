import { Navigate } from "react-router-dom";
import { estaLogado } from "../services/api";

function PrivateRoute({ children }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;