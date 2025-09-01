import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Vehiculo from "../classes/Vehiculo";
import Celda from "../classes/Celda";

const GestionVehiculos = () => {
  const [userVehicles, setUserVehicles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!userData) {
      navigate("/");
      return;
    }
    
    // Usar el nuevo nombre del método
    const vehicles = Vehiculo.obtenerVehiculosActivosPorUsuario(userData.id);
    setUserVehicles(vehicles);
  }, [navigate]);

  // Función para verificar si un vehículo está ocupando una celda
  const estaOcupandoCelda = (vehiculoId) => {
    const celdasOcupadas = Celda.listarCeldas().filter(c => 
      c.vehiculoId === vehiculoId && c.estado === "ocupado"
    );
    return celdasOcupadas.length > 0;
  };

  const handleEliminarVehiculo = (vehiculoId) => {
    // Verificar si el vehículo está ocupando una celda
    if (estaOcupandoCelda(vehiculoId)) {
      setError("No puede eliminar el vehículo mientras esté ocupando un espacio de parqueo.");
      return;
    }

    const vehiculo = Vehiculo.obtenerVehiculoPorId(vehiculoId);
    if (vehiculo) {
      vehiculo.setActivo(false);
      // Actualizar la lista con el nuevo método
      const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
      setUserVehicles(Vehiculo.obtenerVehiculosActivosPorUsuario(userData.id));
      setError("");
      alert("Vehículo eliminado exitosamente.");
    }
  };

  const handleBack = () => {
    navigate("/DashBord");
  };

  return (
    <div className="container mt-3">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4>Gestión de Vehículos</h4>
          <button className="btn btn-light btn-sm" onClick={handleBack}>
            ← Volver al Dashboard
          </button>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {userVehicles.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Tipo</th>
                    <th>Color</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {userVehicles.map(vehicle => {
                    const ocupandoCelda = estaOcupandoCelda(vehicle.id);
                    return (
                      <tr key={vehicle.id}>
                        <td>{vehicle.placa}</td>
                        <td>{vehicle.marca}</td>
                        <td>{vehicle.modelo}</td>
                        <td>{vehicle.tipo}</td>
                        <td>{vehicle.color}</td>
                        <td>
                          <span className={`badge ${ocupandoCelda ? 'bg-danger' : 'bg-success'}`}>
                            {ocupandoCelda ? 'Ocupando' : 'Disponible'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminarVehiculo(vehicle.id)}
                            disabled={ocupandoCelda}
                            title={ocupandoCelda ? "No se puede eliminar mientras ocupa un espacio" : "Eliminar vehículo"}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No tiene vehículos registrados.</p>
          )}

          <div className="mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/registro")}
            >
              Registrar Nuevo Vehículo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionVehiculos;