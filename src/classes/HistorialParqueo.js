class HistorialParqueo {
  static obtenerHistorial() {
    const historial = localStorage.getItem('historialParqueo');
    return historial ? JSON.parse(historial) : [];
  }

  static guardarHistorial(historial) {
    localStorage.setItem('historialParqueo', JSON.stringify(historial));
  }

  static insertarHistorial(registro) {
    const historial = this.obtenerHistorial();
    const nuevoRegistro = {
      id: Date.now(),
      ...registro,
      fecha_hora: registro.fecha_hora.toISOString(),
      fecha_salida: registro.fecha_salida ? registro.fecha_salida.toISOString() : null
    };
    
    historial.push(nuevoRegistro);
    this.guardarHistorial(historial);
    return nuevoRegistro;
  }

  static registrarSalida(celdaId, fechaSalida) {
    const historial = this.obtenerHistorial();
    const registro = historial.find(r => r.CELDA_id === celdaId && !r.fecha_salida);
    
    if (registro) {
      registro.fecha_salida = fechaSalida.toISOString();
      this.guardarHistorial(historial);
      return registro;
    }
    
    return null;
  }

  static obtenerHistorialPorVehiculo(vehiculoId) {
    const historial = this.obtenerHistorial();
    return historial.filter(registro => registro.VEHICULO_id === vehiculoId);
  }

  static obtenerHistorialPorUsuario(usuarioId) {
    // Necesitarías relacionar vehículos con usuario primero
    const historial = this.obtenerHistorial();
    return historial; // Esto sería más complejo en una implementación real
  }
}

export default HistorialParqueo;