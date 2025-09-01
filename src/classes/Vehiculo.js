import Celda from "./Celda";

class Vehiculo {
  static vehiculos = [];
  static ultimoId = 0;

  constructor({ id, placa, color, marca, modelo, tipo, usuarioId, activo = true }) {
    this.id = id;
    this.placa = placa;
    this.color = color;
    this.marca = marca;
    this.modelo = modelo;
    this.tipo = tipo; // "carro", "moto", "bicicleta"
    this.usuarioId = usuarioId;
    this.activo = activo;
  }

  getId() { return this.id; }
  getPlaca() { return this.placa; }
  getColor() { return this.color; }
  getMarca() { return this.marca; }
  getModelo() { return this.modelo; }
  getTipo() { return this.tipo; }
  getUsuarioId() { return this.usuarioId; }
  getActivo() { return this.activo; }

  // SETTERS
  setId(id) { this.id = id; }
  setPlaca(placa) { this.placa = placa; }
  setColor(color) { this.color = color; }
  setMarca(marca) { this.marca = marca; }
  setModelo(modelo) { this.modelo = modelo; }
  setTipo(tipo) { this.tipo = tipo; }
  setUsuarioId(usuarioId) { this.usuarioId = usuarioId; }
  setActivo(activo) { this.activo = activo; }

  // MÉTODOS ESTÁTICOS
  static insertarVehiculo(datos) {
    Vehiculo.ultimoId++;
    const vehiculo = new Vehiculo({
      id: Vehiculo.ultimoId,
      activo: true, // Valor por defecto
      ...datos
    });
    Vehiculo.vehiculos.push(vehiculo);
    return vehiculo;
  }

  static listarVehiculos() {
    return Vehiculo.vehiculos;
  }

  static obtenerVehiculoPorId(id) {
    return Vehiculo.vehiculos.find(v => v.id === id);
  }

  static obtenerVehiculoPorPlaca(placa) {
    return Vehiculo.vehiculos.find(v => v.placa === placa);
  }

  // Método para obtener solo vehículos activos de un usuario
  static obtenerVehiculosActivosPorUsuario(usuarioId) {
    return this.vehiculos.filter(v => v.usuarioId === usuarioId && v.activo);
  }

  // Método para obtener todos los vehículos de un usuario (incluyendo inactivos)
  static obtenerTodosVehiculosPorUsuario(usuarioId) {
    return this.vehiculos.filter(v => v.usuarioId === usuarioId);
  }

  // Nuevo método para verificar si el vehículo está ocupando una celda
  static estaOcupandoCelda(vehiculoId) {
    const celdasOcupadas = Celda.listarCeldas().filter(c =>
      c.vehiculoId === vehiculoId && c.estado === "ocupado"
    );
    return celdasOcupadas.length > 0;
  }

  // Método para desactivar todos los vehículos de un usuario
  static desactivarVehiculosUsuario(usuarioId) {
    const vehiculos = this.obtenerTodosVehiculosPorUsuario(usuarioId);
    vehiculos.forEach(vehiculo => {
      vehiculo.setActivo(false);
    });
  }

  // Método para verificar restricciones de pico y placa
  static verificarPicoPlaca(placa, fecha) {
    // Implementar lógica de pico y placa según la ciudad
    // Esta es una implementación básica de ejemplo
    const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const ultimoDigito = parseInt(placa.slice(-1));
    
    // Ejemplo: Restricción lunes (1) para placas terminadas en 1 y 2
    if (diaSemana === 1 && (ultimoDigito === 1 || ultimoDigito === 2)) {
      return false; // No puede circular
    }
    
    // Agregar más reglas según sea necesario
    return true; // Puede circular
  }

  // Método para obtener vehículos por tipo
  static obtenerVehiculosPorTipo(tipo) {
    return this.vehiculos.filter(v => v.tipo === tipo && v.activo);
  }

  // Método para inicializar algunos vehículos de prueba
  static inicializarDatosPrueba() {
    if (this.vehiculos.length === 0) {
      this.insertarVehiculo({
        placa: "ABC123",
        color: "Rojo",
        marca: "Toyota",
        modelo: "Corolla",
        tipo: "carro",
        usuarioId: 1,
        activo: true
      });

      this.insertarVehiculo({
        placa: "XYZ789",
        color: "Negro",
        marca: "Honda",
        modelo: "CBR",
        tipo: "moto",
        usuarioId: 1,
        activo: true
      });

      this.insertarVehiculo({
        placa: "BIKE001",
        color: "Azul",
        marca: "Trek",
        modelo: "Mountain",
        tipo: "bicicleta",
        usuarioId: 1,
        activo: true
      });

      // Vehículos adicionales para pruebas
      this.insertarVehiculo({
        placa: "DEF456",
        color: "Azul",
        marca: "Nissan",
        modelo: "Sentra",
        tipo: "carro",
        usuarioId: 2,
        activo: true
      });

      this.insertarVehiculo({
        placa: "MOTO002",
        color: "Blanco",
        marca: "Yamaha",
        modelo: "YZF",
        tipo: "moto",
        usuarioId: 2,
        activo: true
      });
    }
  }
}

// Inicializar datos de prueba al cargar
Vehiculo.inicializarDatosPrueba();

export default Vehiculo;