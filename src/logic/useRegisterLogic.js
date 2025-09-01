import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../classes/Usuario";
import Vehiculo from "../classes/Vehiculo";

export const useRegisterLogic = () => {
  const [currentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  });
  
  const [formData, setFormData] = useState({
    tipo_documento: "CC",
    numero_documento: "",
    nombre: "",
    correo: "",
    celular: "",
    tipo_usuario: "usuario", // Por defecto siempre será usuario
    password: ""
  });
  
  const [vehiculoData, setVehiculoData] = useState({
    placa: "",
    color: "",
    marca: "",
    modelo: "",
    tipo: "carro"
  });
  
  const [error, setError] = useState("");
  const [paso, setPaso] = useState(currentUser ? 2 : 1);
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar usuario actual al cargar la página de registro
    if (!currentUser) {
      localStorage.removeItem("currentUser");
    }
    
    // Si el usuario ya está logueado, pre-llenar sus datos
    if (currentUser) {
      setFormData({
        tipo_documento: currentUser.tipo_documento,
        numero_documento: currentUser.numero_documento,
        nombre: currentUser.nombre,
        correo: currentUser.correo,
        celular: currentUser.celular,
        tipo_usuario: currentUser.tipo_usuario,
        password: ""
      });
    }
  }, [currentUser]);

  const handleUserChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleChange = (e) => {
    setVehiculoData({
      ...vehiculoData,
      [e.target.name]: e.target.value
    });
  };

  const validarUsuario = () => {
    if (!formData.tipo_documento || !formData.numero_documento || 
        !formData.nombre || !formData.correo || !formData.celular || !formData.password) {
      setError("Todos los campos son obligatorios");
      return false;
    }

    // Validar que solo admin/operador puedan crear otros roles
    if (formData.tipo_usuario !== 'usuario') {
      if (!currentUser || (currentUser.tipo_usuario !== 'administrador' && currentUser.tipo_usuario !== 'operador')) {
        setError("Solo administradores y operadores pueden crear usuarios con roles especiales");
        return false;
      }
    }

    // Validar que el documento no exista (solo para nuevos usuarios)
    if (!currentUser) {
      const usuarioExistente = Usuario.obtenerUsuarioPorDocumento(formData.numero_documento);
      if (usuarioExistente) {
        setError("El número de documento ya está registrado");
        return false;
      }
    }

    if (!/^\d{7,15}$/.test(formData.celular)) {
      setError("El celular debe contener solo números (7-15 dígitos)");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      setError("Ingrese un email válido");
      return false;
    }

    if (formData.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return false;
    }

    return true;
  };

  const validarVehiculo = () => {
    if (!vehiculoData.placa || !vehiculoData.marca || !vehiculoData.modelo) {
      setError("Todos los campos del vehículo son obligatorios");
      return false;
    }

    // Validar que la placa no exista
    const vehiculoExistente = Vehiculo.obtenerVehiculoPorPlaca(vehiculoData.placa);
    if (vehiculoExistente) {
      setError("La placa ya está registrada");
      return false;
    }

    // Validar que el usuario no tenga ya un vehículo activo
    if (currentUser) {
      const tieneVehiculoActivo = Usuario.tieneVehiculoActivo(currentUser.id);
      if (tieneVehiculoActivo) {
        setError("Ya tiene un vehículo registrado. Debe eliminar el vehículo actual primero.");
        return false;
      }
    }

    return true;
  };

  const handleSiguientePaso = () => {
    setError("");
    if (validarUsuario()) {
      setPaso(2);
    }
  };

  const handleRegresar = () => {
    setPaso(1);
    setError("");
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();
    setError("");

    if (validarVehiculo()) {
      let usuario;

      if (currentUser) {
        // Usuario existente - solo registrar vehículo
        usuario = currentUser;
      } else {
        // Nuevo usuario - crear usuario primero
        usuario = Usuario.insertarUsuario(formData);
      }

      // Crear vehículo
      const vehiculo = Vehiculo.insertarVehiculo({
        ...vehiculoData,
        usuarioId: usuario.id,
        activo: true
      });

      if (vehiculo) {
        if (!currentUser) {
          localStorage.setItem("currentUser", JSON.stringify(usuario));
        }
        navigate("/DashBord");
      }
    }
  };

  return {
    formData,
    vehiculoData,
    error,
    paso,
    currentUser,
    handleUserChange,
    handleVehicleChange,
    handleSiguientePaso,
    handleRegresar,
    handleSubmitFinal
  };
};