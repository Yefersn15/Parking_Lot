import { useTheme } from "./ThemeContext";

const ToggleTheme = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      className="btn btn-sm btn-outline-secondary"
      onClick={toggleTheme}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ToggleTheme;