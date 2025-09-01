// Header.jsx
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { useTheme } from "./ThemeContext";
import ToggleTheme from "./ToggleTheme";
const Header = () => {
  const { themeClass } = useTheme();
  
  return (
    <header className={`${themeClass} p-4`}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <h1 className="mb-0 text-center flex-grow-1">Mi Sitio Web en React+Vite</h1>
          <ToggleTheme/>
          <div className="d-flex align-items-center">
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;