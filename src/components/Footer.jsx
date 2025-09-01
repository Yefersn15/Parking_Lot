// Footer.jsx
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { themeClass } = useTheme();

  return (
    <footer className={`${themeClass} mt-4 pt-4`}>
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-4">
            <h5>Sobre Nosotros</h5>
            <p>
              Sistema de Gestión de Parqueadero - Una solución moderna para 
              administrar espacios de estacionamiento de manera eficiente.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Accesos Rápidos</h5>
            <ul className="list-unstyled">
              <li><Link className="text-white text-decoration-none" to="/DashBord">Dashboard</Link></li>
              <li><Link className="text-white text-decoration-none" to="/Parking">Ver Parqueadero</Link></li>
              <li><Link className="text-white text-decoration-none" to="/gestion-vehiculos">Mis Vehículos</Link></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Soporte</h5>
            <p>
              <i className="bi bi-envelope me-2"></i>
              soporte@parqueadero.com
            </p>
            <p>
              <i className="bi bi-telephone me-2"></i>
              +57 1 234 5678
            </p>
          </div>
        </div>

        <div className="text-center border-top border-secondary py-3 mt-3">
          © {new Date().getFullYear()} Sistema de Parqueadero | Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;