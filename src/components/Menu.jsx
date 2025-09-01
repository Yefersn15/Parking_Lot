// Menu.jsx
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext'; // Asegúrate de que la ruta es correcta

const Menu = () => {
  const { themeClass } = useTheme();
  
  return (
    <nav className={`navbar navbar-expand-lg ${themeClass}`}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">Proyecto Three</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Hooks">Hooks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/LifeCycle">Ciclo de Vida</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Props">Props</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Redux">Redux</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/State">State</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/VirtualDOM">Virtual DOM</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;