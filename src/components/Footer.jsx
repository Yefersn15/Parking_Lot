import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { themeClass } = useTheme();

  return (
    <footer className={`${themeClass} mt-4 pt-5`}>
      <div className="container">
        <div className="row text-center text-md-start">
          <div className="col-md-4 mb-4">
            <h5>Sobre Nosotros</h5>
            <p>
              Proyecto Three es un portal educativo en React donde exploramos
              conceptos clave como Props, State, Hooks, Redux y más.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Páginas</h5>
            <ul className="list-unstyled">
              <li><Link className="text-white text-decoration-none" to="/Props">Props</Link></li>
              <li><Link className="text-white text-decoration-none" to="/State">State</Link></li>
              <li><Link className="text-white text-decoration-none" to="/LifeCycle">Ciclo de Vida</Link></li>
              <li><Link className="text-white text-decoration-none" to="/Hooks">Hooks</Link></li>
              <li><Link className="text-white text-decoration-none" to="/VirtualDOM">Virtual DOM</Link></li>
              <li><Link className="text-white text-decoration-none" to="/Redux">Redux</Link></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Síguenos</h5>
            <a href="https://facebook.com" target="_blank" className="text-white me-3">
              <i className="bi bi-facebook"></i> Facebook
            </a><br />
            <a href="https://twitter.com" target="_blank" className="text-white me-3">
              <i className="bi bi-twitter"></i> Twitter
            </a><br />
            <a href="https://instagram.com" target="_blank" className="text-white">
              <i className="bi bi-instagram"></i> Instagram
            </a>
          </div>
        </div>

        <div className="text-center border-top border-secondary py-3 mt-3">
          © {new Date().getFullYear()} Proyecto Three | Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
};

export default Footer;