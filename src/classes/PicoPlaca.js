class PicoPlaca {
  static obtenerRestricciones() {
    const restricciones = localStorage.getItem('picoPlacaRestricciones');
    return restricciones ? JSON.parse(restricciones) : this.inicializarRestricciones();
  }

  static inicializarRestricciones() {
    const restricciones = [
      { dia: 1, numeros: [1, 2, 3, 4], descanso: false }, // Lunes
      { dia: 2, numeros: [5, 6, 7, 8], descanso: false }, // Martes
      { dia: 3, numeros: [9, 0, 1, 2], descanso: false }, // Miércoles
      { dia: 4, numeros: [3, 4, 5, 6], descanso: false }, // Jueves
      { dia: 5, numeros: [7, 8, 9, 0], descanso: false }, // Viernes
      { dia: 6, numeros: [], descanso: true }, // Sábado
      { dia: 0, numeros: [], descanso: true }  // Domingo
    ];
    
    localStorage.setItem('picoPlacaRestricciones', JSON.stringify(restricciones));
    return restricciones;
  }

  static listarRestricciones() {
    return this.obtenerRestricciones();
  }

  static verificarRestriccion(placa, fecha = new Date()) {
    const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const ultimoDigito = parseInt(placa.slice(-1));
    
    const restricciones = this.obtenerRestricciones();
    const restriccionDia = restricciones.find(r => r.dia === diaSemana);
    
    if (!restriccionDia) return false;
    
    // Si es día de descanso, no hay restricción
    if (restriccionDia.descanso) return false;
    
    // Verificar si el último dígito está restringido
    return restriccionDia.numeros.includes(ultimoDigito);
  }

  static actualizarRestricciones(nuevasRestricciones) {
    localStorage.setItem('picoPlacaRestricciones', JSON.stringify(nuevasRestricciones));
    return true;
  }
}

export default PicoPlaca;