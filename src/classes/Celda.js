class Celda {
  static obtenerCeldas() {
    const celdas = localStorage.getItem('celdas');
    return celdas ? JSON.parse(celdas) : [];
  }

  static guardarCeldas(celdas) {
    localStorage.setItem('celdas', JSON.stringify(celdas));
  }

  static listarCeldas() {
    return this.obtenerCeldas();
  }

  static insertarCelda(celda) {
    const celdas = this.obtenerCeldas();
    const nuevaCelda = {
      id: celda.id || Date.now(),
      tipo: celda.tipo,
      estado: celda.estado || 'disponible',
      area: celda.area,
      vehiculoId: celda.vehiculoId || null,
      fechaEntrada: celda.fechaEntrada || null
    };
    
    celdas.push(nuevaCelda);
    this.guardarCeldas(celdas);
    return nuevaCelda;
  }

  static actualizarEstadoCelda(id, estado, vehiculoId = null) {
    const celdas = this.obtenerCeldas();
    const celdaIndex = celdas.findIndex(c => c.id === id);
    
    if (celdaIndex !== -1) {
      // Validar que el vehículo no esté ya estacionado en otra celda
      if (estado === "ocupado" && vehiculoId) {
        const vehiculoYaEstacionado = celdas.find(c => 
          c.vehiculoId === vehiculoId && c.estado === "ocupado"
        );
        
        if (vehiculoYaEstacionado) {
          throw new Error("El vehículo ya está estacionado en otra celda");
        }
      }
      
      celdas[celdaIndex].estado = estado;
      celdas[celdaIndex].vehiculoId = vehiculoId;
      celdas[celdaIndex].fechaEntrada = estado === 'ocupado' ? new Date().toISOString() : null;
      
      this.guardarCeldas(celdas);
      return celdas[celdaIndex];
    }
    
    return null;
  }

  static obtenerCeldaPorId(id) {
    const celdas = this.obtenerCeldas();
    return celdas.find(c => c.id === id);
  }

  static obtenerCeldasPorTipo(tipo) {
    const celdas = this.obtenerCeldas();
    return celdas.filter(c => c.tipo === tipo);
  }

  static obtenerCeldasPorEstado(estado) {
    const celdas = this.obtenerCeldas();
    return celdas.filter(c => c.estado === estado);
  }

  static obtenerCeldasPorArea(area) {
    const celdas = this.obtenerCeldas();
    return celdas.filter(c => c.area === area);
  }

  static inicializarCeldas() {
    const celdas = [];
    let id = 1;
    
    // Área A - Carros (10 espacios grandes)
    for (let i = 1; i <= 10; i++) {
      celdas.push({
        id: id++,
        tipo: "carro",
        estado: "disponible",
        area: "A",
        vehiculoId: null,
        fechaEntrada: null
      });
    }
    
    // Área B - Motos (10 espacios medianos)
    for (let i = 1; i <= 10; i++) {
      celdas.push({
        id: id++,
        tipo: "moto",
        estado: "disponible",
        area: "B",
        vehiculoId: null,
        fechaEntrada: null
      });
    }
    
    // Área C - Bicicletas (10 espacios pequeños)
    for (let i = 1; i <= 10; i++) {
      celdas.push({
        id: id++,
        tipo: "bicicleta",
        estado: "disponible",
        area: "C",
        vehiculoId: null,
        fechaEntrada: null
      });
    }
    
    this.guardarCeldas(celdas);
    return celdas;
  }
}

export default Celda;