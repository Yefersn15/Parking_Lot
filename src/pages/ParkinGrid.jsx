import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Celda from "../classes/Celda";
import Vehiculo from "../classes/Vehiculo";
import Usuario from "../classes/Usuario";
import AccesoSalidas from "../classes/AccesoSalidas";
import HistorialParqueo from "../classes/HistorialParqueo";
import PicoPlaca from "../classes/PicoPlaca";

const Parking = () => {
  const [celdas, setCeldas] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminOrOperator, setIsAdminOrOperator] = useState(false);
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCellInfo, setSelectedCellInfo] = useState(null);
  const [showCellModal, setShowCellModal] = useState(false);
  const [exitDoor, setExitDoor] = useState("Puerta Principal");
  const [solicitudSalida, setSolicitudSalida] = useState(false);
  const [incidencia, setIncidencia] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!userData) {
      navigate("/");
      return;
    }

    setCurrentUser(userData);
    setIsAdminOrOperator(userData.tipo_usuario === "administrador" || userData.tipo_usuario === "operador");

    // Cargar celdas
    setCeldas(Celda.listarCeldas());

    // Cargar vehículos del usuario
    const vehicles = Vehiculo.obtenerVehiculosActivosPorUsuario(userData.id);
    setUserVehicles(vehicles);

    // Cargar todos los vehículos si es admin/operador
    if (userData.tipo_usuario === "administrador" || userData.tipo_usuario === "operador") {
      setAllVehicles(Vehiculo.listarVehiculos().filter(v => v.activo));
      setFilteredVehicles(Vehiculo.listarVehiculos().filter(v => v.activo));
    }
  }, [navigate]);

  // Filtrar vehículos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = allVehicles.filter(vehicle =>
        vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(allVehicles);
    }
  }, [searchTerm, allVehicles]);

  const handleCellClick = (celda) => {
    if (celda.estado === "ocupado") {
      // Mostrar información de la celda ocupada
      const vehicle = getVehicleInfo(celda.vehiculoId);
      const userInfo = vehicle ? Usuario.obtenerUsuarioPorId(vehicle.usuarioId) : null;
      
      setSelectedCellInfo({
        celda,
        vehicle,
        user: userInfo,
        fechaEntrada: celda.fechaEntrada
      });
      
      // Verificar si el usuario es dueño del vehículo para permitir solicitar salida
      if (currentUser && vehicle && vehicle.usuarioId === currentUser.id) {
        setSolicitudSalida(true);
      } else {
        setSolicitudSalida(false);
      }
      
      // Abrir modal para todos los usuarios
      setShowCellModal(true);
    } else if (celda.estado === "disponible" && selectedVehicle) {
      // VERIFICAR QUE EL VEHÍCULO NO ESTÉ YA ESTACIONADO
      if (Vehiculo.estaOcupandoCelda(selectedVehicle.id)) {
        alert(`⚠️ El vehículo ${selectedVehicle.placa} ya está estacionado en otro espacio.`);
        return;
      }

      // VERIFICAR QUE EL TIPO DE VEHÍCULO COINCIDA CON EL TIPO DE CELDA
      if (selectedVehicle.tipo !== celda.tipo) {
        alert(`⚠️ No puede estacionar un vehículo tipo ${selectedVehicle.tipo} en un espacio para ${celda.tipo}.`);
        return;
      }

      // Verificar pico y placa (excepto para bicicletas)
      if (selectedVehicle.tipo !== "bicicleta" && PicoPlaca.verificarRestriccion(selectedVehicle.placa)) {
        alert(`⚠️ No puede estacionar. Vehículo con placa ${selectedVehicle.placa} tiene restricción de pico y placa hoy.`);
        return;
      }
      
      // Ocupar celda con vehículo seleccionado (todos los usuarios pueden registrar su propia entrada)
      try {
        const celdaActualizada = Celda.actualizarEstadoCelda(celda.id, "ocupado", selectedVehicle.id);
        if (celdaActualizada) {
          // Registrar entrada en AccesoSalidas
          AccesoSalidas.registrarEntrada(selectedVehicle.id, "Puerta Principal");
          
          // Registrar en HistorialParqueo
          HistorialParqueo.insertarHistorial({
            CELDA_id: celda.id,
            VEHICULO_id: selectedVehicle.id,
            fecha_hora: new Date(),
            fecha_salida: null
          });
          
          // Actualizar estado
          setCeldas(Celda.listarCeldas());
          setSelectedVehicle(null);
          alert(`✅ Entrada registrada para ${selectedVehicle.placa} en celda ${celda.id}`);
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleExitVehicle = () => {
    if (!selectedCellInfo) return;
    
    const { celda, vehicle } = selectedCellInfo;
    
    // Dar salida al vehículo (solo admin/operador)
    const celdaActualizada = Celda.actualizarEstadoCelda(celda.id, "disponible", null);
    
    if (celdaActualizada && vehicle) {
      // Calcular tiempo de estadía
      const tiempoEstadia = Math.floor((new Date() - new Date(celda.fechaEntrada)) / 1000 / 60); // minutos
      
      // Registrar salida en AccesoSalidas
      AccesoSalidas.registrarSalida(vehicle.id, exitDoor, tiempoEstadia);
      
      // Registrar salida en HistorialParqueo
      HistorialParqueo.registrarSalida(celda.id, new Date());
      
      // Registrar incidencia si existe
      if (incidencia.trim() !== "") {
        const incidencias = JSON.parse(localStorage.getItem('incidencias') || '[]');
        incidencias.push({
          id: Date.now(),
          vehiculoId: vehicle.id,
          celdaId: celda.id,
          descripcion: incidencia,
          fecha: new Date().toISOString(),
          registradaPor: currentUser.id
        });
        localStorage.setItem('incidencias', JSON.stringify(incidencias));
      }
      
      // Actualizar estado
      setCeldas(Celda.listarCeldas());
      setShowCellModal(false);
      setSelectedCellInfo(null);
      setSolicitudSalida(false);
      setIncidencia("");
      alert(`✅ Salida registrada para el vehículo ${vehicle.placa} por la ${exitDoor}`);
    }
  };

  const handleSolicitarSalida = () => {
    if (!selectedCellInfo) return;
    
    const { celda, vehicle } = selectedCellInfo;
    
    // Registrar solicitud de salida (solo para usuarios normales de SU vehículo)
    if (vehicle && currentUser && vehicle.usuarioId === currentUser.id) {
      // Guardar la solicitud en localStorage
      const solicitudes = JSON.parse(localStorage.getItem('solicitudesSalida') || '[]');
      solicitudes.push({
        id: Date.now(),
        celdaId: celda.id,
        vehiculoId: vehicle.id,
        usuarioId: currentUser.id,
        placa: vehicle.placa,
        fechaSolicitud: new Date().toISOString(),
        estado: 'pendiente',
        puertaSolicitada: exitDoor
      });
      localStorage.setItem('solicitudesSalida', JSON.stringify(solicitudes));
      
      setShowCellModal(false);
      setSelectedCellInfo(null);
      setSolicitudSalida(false);
      alert(`📨 Solicitud de salida enviada para el vehículo ${vehicle.placa}. Un operador procesará su solicitud.`);
    } else {
      alert("❌ No tiene permisos para solicitar salida de este vehículo.");
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const getVehicleInfo = (vehiculoId) => {
    if (!vehiculoId) return null;
    return Vehiculo.obtenerVehiculoPorId(vehiculoId);
  };

  const getCellColor = (celda) => {
    if (celda.estado === "ocupado") return "bg-danger";
    if (celda.estado === "disponible") return "bg-success";
    return "bg-secondary";
  };

  const getCellIcon = (celda) => {
    switch (celda.tipo) {
      case "carro": return "🚗";
      case "moto": return "🏍️";
      case "bicicleta": return "🚲";
      default: return "🅿️";
    }
  };

  const renderCeldasPorArea = (area) => {
    const celdasArea = celdas.filter(c => c.area === area);
    
    return (
      <div className="mb-4">
        <h4>Área {area} - {celdasArea[0]?.tipo === "carro" ? "Carros" : celdasArea[0]?.tipo === "moto" ? "Motos" : "Bicicletas"}</h4>
        <div className="row">
          {celdasArea.map(celda => {
            const vehicle = getVehicleInfo(celda.vehiculoId);
            return (
              <div key={celda.id} className="col-md-2 mb-2">
                <div 
                  className={`card text-white ${getCellColor(celda)} ${celda.estado === "ocupado" || (isAdminOrOperator && celda.estado === "disponible") ? 'clickable' : ''}`}
                  onClick={() => handleCellClick(celda)}
                  style={{ cursor: celda.estado === "ocupado" || (isAdminOrOperator && celda.estado === "disponible") ? 'pointer' : 'default' }}
                >
                  <div className="card-body text-center p-2">
                    <h5>{getCellIcon(celda)} {celda.id}</h5>
                    <small>
                      {celda.estado === "ocupado" ? (
                        vehicle ? `Ocupado: ${vehicle.placa}` : "Ocupado"
                      ) : "Disponible"}
                    </small>
                    {celda.estado === "ocupado" && celda.fechaEntrada && (
                      <small className="d-block">
                        Entrada: {new Date(celda.fechaEntrada).toLocaleTimeString()}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Sistema de Parqueadero</h2>
        <button className="btn btn-primary" onClick={() => navigate("/DashBord")}>
          ← Volver al Dashboard
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-9">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Estado del Parqueadero</h3>
            </div>
            <div className="card-body">
              {/* Estadísticas rápidas */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5>Total</h5>
                      <h3>{celdas.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5>Disponibles</h5>
                      <h3 className="text-success">{celdas.filter(c => c.estado === "disponible").length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5>Ocupados</h5>
                      <h3 className="text-danger">{celdas.filter(c => c.estado === "ocupado").length}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Áreas de parqueo */}
              {['A', 'B', 'C'].map(area => (
                <div key={area}>
                  {renderCeldasPorArea(area)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h4>Vehículos</h4>
            </div>
            <div className="card-body">
              {isAdminOrOperator && (
                <>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showAllVehicles"
                      checked={showAllVehicles}
                      onChange={() => setShowAllVehicles(!showAllVehicles)}
                    />
                    <label className="form-check-label" htmlFor="showAllVehicles">
                      Mostrar todos los vehículos
                    </label>
                  </div>

                  {showAllVehicles && (
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar vehículo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {(showAllVehicles && isAdminOrOperator ? filteredVehicles : userVehicles).map(vehicle => (
                  <button
                    key={vehicle.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${selectedVehicle?.id === vehicle.id ? 'active' : ''}`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{vehicle.placa}</h6>
                      <small>{vehicle.tipo}</small>
                    </div>
                    <p className="mb-1">{vehicle.marca} {vehicle.modelo}</p>
                    <small>{vehicle.color}</small>
                  </button>
                ))}
              </div>

              {selectedVehicle && (
                <div className="alert alert-info mt-3">
                  <strong>Vehículo seleccionado:</strong> {selectedVehicle.placa}
                  <br />
                  <small>Haga clic en una celda disponible para registrar entrada</small>
                </div>
              )}

              {isAdminOrOperator && (
                <div className="alert alert-warning mt-3">
                  <strong>Función de administrador/operador:</strong>
                  <br />
                  - Click en celda ocupada: Ver información/Registrar salida
                  <br />
                  - Click en celda disponible: Registrar entrada
                </div>
              )}

              {!isAdminOrOperator && (
                <div className="alert alert-info mt-3">
                  <strong>Función de usuario:</strong>
                  <br />
                  - Click en celda disponible: Registrar entrada de SU vehículo
                  <br />
                  - Click en celda ocupada con SU vehículo: Ver información/Solicitar salida
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para información de celda ocupada */}
      {showCellModal && selectedCellInfo && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información de Celda Ocupada</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowCellModal(false);
                  setSolicitudSalida(false);
                  setIncidencia("");
                }}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Celda:</strong> {selectedCellInfo.celda.id} ({selectedCellInfo.celda.tipo})
                    </div>
                    
                    {selectedCellInfo.vehicle && (
                      <div className="mb-3">
                        <strong>Vehículo:</strong> {selectedCellInfo.vehicle.placa} - {selectedCellInfo.vehicle.marca} {selectedCellInfo.vehicle.modelo}
                        <br />
                        <strong>Tipo:</strong> {selectedCellInfo.vehicle.tipo}
                        <br />
                        <strong>Color:</strong> {selectedCellInfo.vehicle.color}
                      </div>
                    )}
                    
                    {selectedCellInfo.user && (
                      <div className="mb-3">
                        <strong>Usuario:</strong> {selectedCellInfo.user.nombre}
                        <br />
                        <strong>Documento:</strong> {selectedCellInfo.user.tipo_documento} {selectedCellInfo.user.numero_documento}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <strong>Hora de entrada:</strong> {new Date(selectedCellInfo.fechaEntrada).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    {(isAdminOrOperator || solicitudSalida) && (
                      <div className="mb-3">
                        <label className="form-label"><strong>Puerta de salida:</strong></label>
                        <select 
                          className="form-select"
                          value={exitDoor}
                          onChange={(e) => setExitDoor(e.target.value)}
                        >
                          <option value="Puerta Principal">Puerta Principal</option>
                          <option value="Puerta Trasera">Puerta Trasera</option>
                          <option value="Puerta de Emergencia">Puerta de Emergencia</option>
                        </select>
                      </div>
                    )}
                    
                    {isAdminOrOperator && (
                      <div className="mb-3">
                        <label className="form-label"><strong>Reportar incidencia (opcional):</strong></label>
                        <textarea 
                          className="form-control"
                          rows="3"
                          placeholder="Describa cualquier incidencia ocurrida..."
                          value={incidencia}
                          onChange={(e) => setIncidencia(e.target.value)}
                        ></textarea>
                        <small className="text-muted">Ej: Rayones, choques, atropellamientos, golpes contra muros</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCellModal(false);
                  setSolicitudSalida(false);
                  setIncidencia("");
                }}>
                  Cerrar
                </button>
                {isAdminOrOperator ? (
                  <button type="button" className="btn btn-primary" onClick={handleExitVehicle}>
                    Registrar Salida
                  </button>
                ) : solicitudSalida ? (
                  <button type="button" className="btn btn-warning" onClick={handleSolicitarSalida}>
                    Solicitar Salida
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking;