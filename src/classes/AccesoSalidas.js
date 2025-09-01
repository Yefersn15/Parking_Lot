class AccesoSalidas {
  static obtenerRegistros() {
    const registros = localStorage.getItem('accesoSalidasRegistros');
    return registros ? JSON.parse(registros) : [];
  }

  static guardarRegistros(registros) {
    localStorage.setItem('accesoSalidasRegistros', JSON.stringify(registros));
  }

  static registrarEntrada(vehiculoId, puerta) {
    const registros = this.obtenerRegistros();
    const nuevoRegistro = {
      id: Date.now(),
      vehiculoId,
      tipo: 'entrada',
      puerta,
      fechaHora: new Date().toISOString(),
      tiempoEstadia: null
    };
    
    registros.push(nuevoRegistro);
    this.guardarRegistros(registros);
    return nuevoRegistro;
  }

  static registrarSalida(vehiculoId, puerta, tiempoEstadia) {
    const registros = this.obtenerRegistros();
    const nuevoRegistro = {
      id: Date.now(),
      vehiculoId,
      tipo: 'salida',
      puerta,
      fechaHora: new Date().toISOString(),
      tiempoEstadia
    };
    
    registros.push(nuevoRegistro);
    this.guardarRegistros(registros);
    return nuevoRegistro;
  }

  static obtenerRegistrosPorVehiculo(vehiculoId) {
    const registros = this.obtenerRegistros();
    return registros.filter(registro => registro.vehiculoId === vehiculoId);
  }

  static obtenerRegistrosPorFecha(fecha) {
    const registros = this.obtenerRegistros();
    return registros.filter(registro => registro.fechaHora.startsWith(fecha));
  }
}

export default AccesoSalidas;