import { useRegisterLogic } from "../logic/useRegisterLogic";

const Register = () => {
  const {
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
  } = useRegisterLogic();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">
                {currentUser ? "Registro de Vehículo" : "Registro " + (paso === 1 ? "de Usuario" : "de Vehículo")}
              </h3>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}

              {currentUser && (
                <div className="alert alert-info mb-4">
                  <h5>Usuario Actual: {currentUser.nombre}</h5>
                  <p>Documento: {currentUser.tipo_documento} {currentUser.numero_documento}</p>
                  <p>Solo puede registrar un vehículo a la vez. Debe eliminar el vehículo actual para registrar uno nuevo.</p>
                </div>
              )}

              {paso === 1 ? (
                // Formulario de usuario (solo para nuevos usuarios)
                <div>
                  <h4 className="mb-4">Datos Personales</h4>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Documento *</label>
                      <select
                        className="form-select"
                        name="tipo_documento"
                        value={formData.tipo_documento}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="CC">Cédula</option>
                        <option value="TI">Tarjeta Identidad</option>
                        <option value="CE">Cédula Extranjería</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Número de Documento *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="numero_documento"
                        value={formData.numero_documento}
                        onChange={handleUserChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleUserChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Correo Electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={formData.correo}
                        onChange={handleUserChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Número de Celular *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="celular"
                        value={formData.celular}
                        onChange={handleUserChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tipo de Usuario *</label>
                      <select
                        className="form-select"
                        name="tipo_usuario"
                        value={formData.tipo_usuario}
                        onChange={handleUserChange}
                        required
                        disabled={!currentUser || (currentUser.tipo_usuario !== 'administrador' && currentUser.tipo_usuario !== 'operador')}
                      >
                        <option value="usuario">Usuario</option>
                        {(currentUser && (currentUser.tipo_usuario === 'administrador' || currentUser.tipo_usuario === 'operador')) && (
                          <>
                            <option value="operador">Operador</option>
                            <option value="administrador">Administrador</option>
                          </>
                        )}
                      </select>
                      <small className="form-text text-muted">
                        {!currentUser 
                          ? 'Los nuevos usuarios siempre serán tipo "Usuario"' 
                          : (currentUser.tipo_usuario !== 'administrador' && currentUser.tipo_usuario !== 'operador')
                            ? 'Solo administradores pueden cambiar roles'
                            : 'Puede asignar diferentes roles'}
                      </small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleUserChange}
                        placeholder="Mínimo 4 caracteres"
                        required
                        minLength={4}
                      />
                      <small className="form-text text-muted">
                        La contraseña es obligatoria por seguridad
                      </small>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSiguientePaso}
                    >
                      Siguiente → Datos del Vehículo
                    </button>
                  </div>
                </div>
              ) : (
                // Formulario de vehículo
                <div>
                  <h4 className="mb-4">Datos del Vehículo</h4>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Placa *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="placa"
                        value={vehiculoData.placa}
                        onChange={handleVehicleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Color *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        value={vehiculoData.color}
                        onChange={handleVehicleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Marca *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="marca"
                        value={vehiculoData.marca}
                        onChange={handleVehicleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Modelo *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="modelo"
                        value={vehiculoData.modelo}
                        onChange={handleVehicleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tipo de Vehículo *</label>
                    <select className="form-select" name="tipo" value={vehiculoData.tipo}
                    onChange={handleVehicleChange} required >
                      <option value="carro">Carro</option>
                      <option value="moto">Moto</option>
                      <option value="bicicleta">Bicicleta</option>
                    </select>
                  </div>

                  <div className="d-grid gap-2 d-md-flex">
                    {!currentUser && (
                      <button
                        type="button"
                        className="btn btn-secondary me-md-2"
                        onClick={handleRegresar}
                      >
                        ← Regresar
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-primary flex-grow-1"
                      onClick={handleSubmitFinal}
                    >
                      {currentUser ? "Registrar Vehículo" : "Completar Registro"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;