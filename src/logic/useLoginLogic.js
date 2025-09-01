import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../classes/Usuario";
import Vehiculo from "../classes/Vehiculo";
import Celda from "../classes/Celda";

export const useLoginLogic = () => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Inicializar datos de prueba al cargar el componente
  useEffect(() => {
    Usuario.inicializarDatosPrueba();
    Vehiculo.inicializarDatosPrueba();
    
    // Inicializar celdas si no existen
    if (Celda.listarCeldas().length === 0) {
      // Inicializar celdas manualmente si la función no existe
      let id = 1;
      
      // Área A - Carros (10 espacios grandes)
      for (let i = 1; i <= 10; i++) {
        Celda.insertarCelda({
          id: id++,
          tipo: "carro",
          estado: "disponible",
          area: "A"
        });
      }
      
      // Área B - Motos (10 espacios medianos)
      for (let i = 1; i <= 10; i++) {
        Celda.insertarCelda({
          id: id++,
          tipo: "moto",
          estado: "disponible",
          area: "B"
        });
      }
      
      // Área C - Bicicletas (10 espacios pequeños)
      for (let i = 1; i <= 10; i++) {
        Celda.insertarCelda({
          id: id++,
          tipo: "bicicleta",
          estado: "disponible",
          area: "C"
        });
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!numeroDocumento) {
      setError("Por favor, ingrese su número de documento");
      return;
    }

    if (!password) {
      setError("Por favor, ingrese su contraseña");
      return;
    }

    // Buscar usuario por número de documento
    const usuario = Usuario.obtenerUsuarioPorDocumento(numeroDocumento);

    if (usuario) {
      // Validar que el usuario esté activo
      if (!usuario.activo) {
        setError("Usuario inactivo. Contacte al administrador.");
        return;
      }

      // Validar contraseña para TODOS los usuarios
      if (password !== usuario.password) {
        setError("Contraseña incorrecta");
        return;
      }
      
      localStorage.setItem("currentUser", JSON.stringify(usuario));
      setError("");
      navigate("/DashBord");
    } else {
      setError("Usuario no encontrado. Regístrese primero.");
    }
  };

  return {
    numeroDocumento,
    setNumeroDocumento,
    password,
    setPassword,
    error,
    setError,
    handleSubmit
  };
};