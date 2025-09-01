import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../classes/Usuario";
import Vehiculo from "../classes/Vehiculo";
import Celda from "../classes/Celda";
import PicoPlaca from "../classes/PicoPlaca";
import HistorialParqueo from "../classes/HistorialParqueo";
import AccesoSalidas from "../classes/AccesoSalidas";

const DashBord = () => {
  const [user, setUser] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [parkingStats, setParkingStats] = useState({
    total: 0,
    disponibles: 0,
    ocupados: 0
  });
  const [userParkingHistory, setUserParkingHistory] = useState([]);
  const [allParkingHistory, setAllParkingHistory] = useState([]);
  const [picoPlacaInfo, setPicoPlacaInfo] = useState([]);
  const [showPicoPlacaEdit, setShowPicoPlacaEdit] = useState(false);
  const [incidencias, setIncidencias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!userData) {
      navigate("/");
      return;
    }

    setUser(userData);

    // Obtener vehículos del usuario
    const vehicles = Vehiculo.obtenerVehiculosActivosPorUsuario(userData.id);
    setUserVehicles(vehicles);

    // Obtener estadísticas del parking
    const allCells = Celda.listarCeldas();
    const stats = {
      total: allCells.length,
      disponibles: allCells.filter(c => c.estado === "disponible").length,
      ocupados: allCells.filter(c => c.estado === "ocupado").length
    };
    setParkingStats(stats);

    // Obtener historial de parking del usuario
    const userHistory = HistorialParqueo.obtenerHistorial().filter(record => 
      vehicles.some(v => v.id === record.VEHICULO_id)
    );
    setUserParkingHistory(userHistory);

    // Obtener historial completo (solo para admin/operador)
    if (userData.tipo_usuario === "administrador" || userData.tipo_usuario === "operador") {
      setAllParkingHistory(HistorialParqueo.obtenerHistorial());
    }

    // Obtener información de pico y placa
    const picoPlacaData = PicoPlaca.listarRestricciones();
    setPicoPlacaInfo(picoPlacaData);

    // Obtener incidencias
    const storedIncidencias = JSON.parse(localStorage.getItem('incidencias') || '[]');
    setIncidencias(storedIncidencias);
  }, [navigate]);

  // Función para verificar si un vehículo está ocupando una celda
  const estaOcupandoCelda = (vehiculoId) => {
    const celdasOcupadas = Celda.listarCeldas().filter(c => 
      c.vehiculoId === vehiculoId && c.estado === "ocupado"
    );
    return celdasOcupadas.length > 0;
  };

  // Función para eliminar todos los registros de parqueo (solo administrador)
  const handleEliminarTodosRegistros = () => {
    if (user.tipo_usuario !== "administrador") {
      alert("Solo los administradores pueden eliminar todos los registros");
      return;
    }

    if (window.confirm("¿Está seguro de que desea eliminar TODOS los registros de parqueo? Esta acción no se puede deshacer.")) {
      localStorage.setItem('historialParqueo', JSON.stringify([]));
      setAllParkingHistory([]);
      setUserParkingHistory([]);
      alert("Todos los registros de parqueo han sido eliminados");
    }
  };

  // Función para eliminar un registro individual (admin y operadores)
  const handleEliminarRegistro = (registroId) => {
    if (user.tipo_usuario !== "administrador" && user.tipo_usuario !== "operador") {
      alert("No tiene permisos para eliminar registros");
      return;
    }

    if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
      const historialActual = HistorialParqueo.obtenerHistorial();
      const nuevoHistorial = historialActual.filter(registro => registro.id !== registroId);
      
      localStorage.setItem('historialParqueo', JSON.stringify(nuevoHistorial));
      
      // Actualizar estados
      if (user.tipo_usuario === "administrador") {
        setAllParkingHistory(nuevoHistorial);
      }
      
      const userHistory = nuevoHistorial.filter(record => 
        userVehicles.some(v => v.id === record.VEHICULO_id)
      );
      setUserParkingHistory(userHistory);
      
      alert("Registro eliminado exitosamente");
    }
  };

  // Función para actualizar restricciones de pico y placa
  const handleUpdatePicoPlaca = (dia, numeros, descanso) => {
    const nuevasRestricciones = picoPlacaInfo.map(restriccion => 
      restriccion.dia === dia ? { ...restriccion, numeros, descanso } : restriccion
    );
    
    PicoPlaca.actualizarRestricciones(nuevasRestricciones);
    setPicoPlacaInfo(nuevasRestricciones);
    setShowPicoPlacaEdit(false);
    alert("Restricciones de pico y placa actualizadas correctamente.");
  };

  // Función para obtener el nombre del día
  const getDiaNombre = (diaNumero) => {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[diaNumero] || "Desconocido";
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "En uso";
    return new Date(dateString).toLocaleString();
  };

  // Función para obtener información del vehículo
  const getVehicleInfo = (vehicleId) => {
    return Vehiculo.obtenerVehiculoPorId(vehicleId);
  };

  // Función para obtener información de la celda
  const getCellInfo = (cellId) => {
    return Celda.obtenerCeldaPorId(cellId);
  };

  // Agrupar historial por tipo de vehículo
  const groupHistoryByVehicleType = (history) => {
    const grouped = {
      carro: [],
      moto: [],
      bicicleta: []
    };
    
    history.forEach(record => {
      const vehicle = getVehicleInfo(record.VEHICULO_id);
      if (vehicle) {
        grouped[vehicle.tipo].push(record);
      }
    });
    
    return grouped;
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const goToParking = () => {
    navigate("/Parking");
  };

  if (!user) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  const isAdminOrOperator = user.tipo_usuario === "administrador" || user.tipo_usuario === "operador";
  const isAdmin = user.tipo_usuario === "administrador";
  const groupedHistory = groupHistoryByVehicleType(isAdminOrOperator ? allParkingHistory : userParkingHistory);

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        {/* Panel de información del usuario (30%) */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4>Información del Usuario</h4>
            </div>
            <div className="card-body">
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Documento:</strong> {user.tipo_documento} {user.numero_documento}</p>
              <p><strong>Email:</strong> {user.correo}</p>
              <p><strong>Celular:</strong> {user.celular}</p>
              <p><strong>Tipo de usuario:</strong> 
                <span className={`badge ${user.tipo_usuario === 'administrador' ? 'bg-danger' : user.tipo_usuario === 'operador' ? 'bg-warning' : 'bg-success'}`}>
                  {user.tipo_usuario}
                </span>
              </p>

              <hr />

              <h5>Vehículos registrados:</h5>
              {userVehicles.length > 0 ? (
                <ul className="list-group">
                  {userVehicles.map(vehicle => {
                    const ocupando = estaOcupandoCelda(vehicle.id);
                    return (
                      <li key={vehicle.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          {vehicle.marca} {vehicle.modelo} - {vehicle.placa} ({vehicle.tipo})
                        </div>
                        <span className={`badge ${ocupando ? 'bg-danger' : 'bg-success'}`}>
                          {ocupando ? '🅿️ Ocupando' : '✅ Libre'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No tiene vehículos registrados</p>
              )}
              
              <button
                className="btn btn-info mt-2 w-100"
                onClick={() => navigate("/gestion-vehiculos")}
              >
                🚗 Gestionar Vehículos
              </button>
              
              <button
                className="btn btn-success mt-3 w-100"
                onClick={goToParking}
              >
                🅿️ Ver Parqueadero
              </button>

              {/* Botones para administradores y operadores */}
              {isAdminOrOperator && (
                <button
                  className="btn btn-warning mt-2 w-100"
                  onClick={() => navigate("/admin-registro")}
                >
                  👥 Registrar Nuevo Usuario
                </button>
              )}

              <button
                className="btn btn-danger mt-2 w-100"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Espacio para contenido adicional (70%) */}
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4>Bienvenido al Sistema de Parqueadero</h4>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h5>🚗 Sistema de Gestión de Parqueadero 🚗</h5>
                <p>Selecciona "Ver Parqueadero" para ver los espacios disponibles</p>

                <div className="row mt-4">
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Espacios Totales</h6>
                        <h3>{parkingStats.total}</h3>
                        <small>Total de celdas</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Disponibles</h6>
                        <h3 className="text-success">{parkingStats.disponibles}</h3>
                        <small>Espacios libres</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Ocupados</h6>
                        <h3 className="text-danger">{parkingStats.ocupados}</h3>
                        <small>Espacios en uso</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historial de parking */}
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>{isAdminOrOperator ? "Historial Completo de Parqueo" : "Tu Historial de Parqueo"}</h6>
                    
                    {isAdmin && (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={handleEliminarTodosRegistros}
                        title="Eliminar todos los registros de parqueo"
                      >
                        🗑️ Eliminar Todos
                      </button>
                    )}
                  </div>
                  
                  {isAdminOrOperator ? (
                    // Vista para admin/operador (agrupado por tipo)
                    <>
                      {Object.entries(groupedHistory).map(([tipo, registros]) => (
                        registros.length > 0 && (
                          <div key={tipo} className="mb-4">
                            <h6 className="text-capitalize">{tipo}s</h6>
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Espacio</th>
                                    <th>Vehículo</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Duración</th>
                                    <th>Estado</th>
                                    {isAdminOrOperator && <th>Acciones</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {registros.map(record => {
                                    const vehicle = getVehicleInfo(record.VEHICULO_id);
                                    const cell = getCellInfo(record.CELDA_id);
                                    const entrada = new Date(record.fecha_hora);
                                    const salida = record.fecha_salida ? new Date(record.fecha_salida) : null;
                                    const duracion = salida ? Math.round((salida - entrada) / 60000) : null;
                                    
                                    return (
                                      <tr key={record.id}>
                                        <td>#{cell?.id || 'N/A'}</td>
                                        <td>{vehicle ? `${vehicle.marca} ${vehicle.placa}` : 'N/A'}</td>
                                        <td>{formatDate(record.fecha_hora)}</td>
                                        <td>{formatDate(record.fecha_salida)}</td>
                                        <td>{duracion ? `${duracion} min` : 'En uso'}</td>
                                        <td>
                                          <span className={`badge ${record.fecha_salida ? 'bg-success' : 'bg-danger'}`}>
                                            {record.fecha_salida ? 'Completado' : 'Activo'}
                                          </span>
                                        </td>
                                        {isAdminOrOperator && (
                                          <td>
                                            <button
                                              className="btn btn-outline-danger btn-sm"
                                              onClick={() => handleEliminarRegistro(record.id)}
                                              title="Eliminar este registro"
                                            >
                                              🗑️
                                            </button>
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )
                      ))}
                    </>
                  ) : (
                    // Vista para usuario normal
                    userParkingHistory.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Espacio</th>
                              <th>Vehículo</th>
                              <th>Entrada</th>
                              <th>Salida</th>
                              <th>Duración</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userParkingHistory.map(record => {
                              const vehicle = getVehicleInfo(record.VEHICULO_id);
                              const cell = getCellInfo(record.CELDA_id);
                              const entrada = new Date(record.fecha_hora);
                              const salida = record.fecha_salida ? new Date(record.fecha_salida) : null;
                              const duracion = salida ? Math.round((salida - entrada) / 60000) : null;
                              
                              return (
                                <tr key={record.id}>
                                  <td>#{cell?.id || 'N/A'}</td>
                                  <td>{vehicle ? `${vehicle.marca} ${vehicle.placa}` : 'N/A'}</td>
                                  <td>{formatDate(record.fecha_hora)}</td>
                                  <td>{formatDate(record.fecha_salida)}</td>
                                  <td>{duracion ? `${duracion} min` : 'En uso'}</td>
                                  <td>
                                    <span className={`badge ${record.fecha_salida ? 'bg-success' : 'bg-danger'}`}>
                                      {record.fecha_salida ? 'Completado' : 'Activo'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted">No hay registros de parqueo</p>
                    )
                  )}
                </div>

                {/* Incidencias */}
                {incidencias.length > 0 && isAdminOrOperator && (
                  <div className="mt-4">
                    <h6>📝 Incidencias Reportadas</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Vehículo</th>
                            <th>Celda</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incidencias.map(incidencia => {
                            const vehicle = getVehicleInfo(incidencia.vehiculoId);
                            return (
                              <tr key={incidencia.id}>
                                <td>{vehicle ? `${vehicle.placa} (${vehicle.marca})` : 'N/A'}</td>
                                <td>#{incidencia.celdaId}</td>
                                <td>{incidencia.descripcion}</td>
                                <td>{new Date(incidencia.fecha).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Card de Pico y Placa */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
                        <h5>Pico y Placa</h5>
                        {isAdminOrOperator && (
                          <button 
                            className="btn btn-sm btn-light"
                            onClick={() => setShowPicoPlacaEdit(!showPicoPlacaEdit)}
                          >
                            {showPicoPlacaEdit ? 'Cancelar' : 'Editar'}
                          </button>
                        )}
                      </div>
                      <div className="card-body">
                        <h6>🚫 Restricciones de Circulación 🚫</h6>
                        
                        {showPicoPlacaEdit ? (
                          <div className="mt-3">
                            {picoPlacaInfo.map((restriccion, index) => (
                              <div key={index} className="card mb-2">
                                <div className="card-body">
                                  <h6>{getDiaNombre(restriccion.dia)}</h6>
                                  <div className="form-check mb-2">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={restriccion.descanso}
                                      onChange={(e) => {
                                        const nuevasRestricciones = [...picoPlacaInfo];
                                        nuevasRestricciones[index].descanso = e.target.checked;
                                        setPicoPlacaInfo(nuevasRestricciones);
                                      }}
                                    />
                                    <label className="form-check-label">
                                      Día de descanso (sin restricciones)
                                    </label>
                                  </div>
                                  
                                  {!restriccion.descanso && (
                                    <div className="mb-2">
                                      <label className="form-label">Placas restringidas (último dígito):</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={restriccion.numeros.join(', ')}
                                        onChange={(e) => {
                                          const nuevasRestricciones = [...picoPlacaInfo];
                                          const numeros = e.target.value
                                            .split(',')
                                            .map(n => parseInt(n.trim()))
                                            .filter(n => !isNaN(n) && n >= 0 && n <= 9);
                                          nuevasRestricciones[index].numeros = numeros;
                                          setPicoPlacaInfo(nuevasRestricciones);
                                        }}
                                        placeholder="Ej: 1, 2, 3, 4"
                                      />
                                      <small className="text-muted">Ingrese números separados por coma (0-9)</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            <div className="d-grid gap-2">
                              <button 
                                className="btn btn-primary"
                                onClick={() => {
                                  PicoPlaca.actualizarRestricciones(picoPlacaInfo);
                                  setShowPicoPlacaEdit(false);
                                  alert("Restricciones actualizadas correctamente.");
                                }}
                              >
                                Guardar Cambios
                              </button>
                              <button 
                                className="btn btn-secondary"
                                onClick={() => setShowPicoPlacaEdit(false)}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3">
                            {picoPlacaInfo.map((restriccion, index) => (
                              <div key={index} className="alert alert-info p-2 mb-2">
                                <strong>{getDiaNombre(restriccion.dia)}:</strong> 
                                <br />
                                {restriccion.descanso ? 
                                  "Día de descanso - Sin restricciones" : 
                                  `Placas terminadas en: ${restriccion.numeros.join(", ")}`
                                }
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBord;