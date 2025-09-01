// Header.jsx
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import ToggleTheme from "./ToggleTheme";

const Header = () => {
  const { themeClass } = useTheme();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
  
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };
  
  return (
    <header className={`${themeClass} p-3`}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <i className="bi bi-p-circle fs-2 text-warning me-2"></i>
            <h1 className="mb-0 fs-4">Sistema de Parqueadero</h1>
          </div>
          
          <div className="d-flex align-items-center">
            {userData && (
              <>
                <span className="me-3 d-none d-md-block">
                  Bienvenido, <strong>{userData.nombre}</strong> 
                  <span className={`badge ${userData.tipo_usuario === 'administrador' ? 'bg-danger' : userData.tipo_usuario === 'operador' ? 'bg-warning' : 'bg-success'} ms-2`}>
                    {userData.tipo_usuario}
                  </span>
                </span>
                <button 
                  className="btn btn-outline-light btn-sm me-2"
                  onClick={() => navigate("/DashBord")}
                >
                  <i className="bi bi-speedometer2 me-1"></i>Dashboard
                </button>
                <button 
                  className="btn btn-outline-light btn-sm me-2"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>Salir
                </button>
              </>
            )}
            <ToggleTheme/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;