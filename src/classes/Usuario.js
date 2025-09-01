import Vehiculo from "./Vehiculo";

class Usuario {
  static usuarios = [];
  static ultimoId = 0;

  constructor({ id, tipo_documento, numero_documento, nombre, correo, celular, tipo_usuario, password, activo = true }) {
    this.id = id;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.nombre = nombre;
    this.correo = correo;
    this.celular = celular;
    this.tipo_usuario = tipo_usuario;
    this.password = password || "";
    this.activo = activo;
  }

  // GETTERS
  getId() { return this.id; }
  getTipoDocumento() { return this.tipo_documento; }
  getNumeroDocumento() { return this.numero_documento; }
  getNombre() { return this.nombre; }
  getCorreo() { return this.correo; }
  getCelular() { return this.celular; }
  getTipoUsuario() { return this.tipo_usuario; }
  getPassword() { return this.password; }
  getActivo() { return this.activo; }

  // SETTERS
  setId(id) { this.id = id; }
  setTipoDocumento(tipo_documento) { this.tipo_documento = tipo_documento; }
  setNumeroDocumento(numero_documento) { this.numero_documento = numero_documento; }
  setNombre(nombre) { this.nombre = nombre; }
  setCorreo(correo) { this.correo = correo; }
  setCelular(celular) { this.celular = celular; }
  setTipoUsuario(tipo_usuario) { this.tipo_usuario = tipo_usuario; }
  setPassword(password) { this.password = password; }
  setActivo(activo) { this.activo = activo; }

  // MÉTODOS ESTÁTICOS
  static insertarUsuario(datos) {
    Usuario.ultimoId++;
    const usuario = new Usuario({
      id: Usuario.ultimoId,
      ...datos
    });
    Usuario.usuarios.push(usuario);
    return usuario;
  }

  static listarUsuarios() {
    return Usuario.usuarios;
  }

  static obtenerUsuarioPorId(id) {
    return Usuario.usuarios.find(u => u.id === id);
  }

  static obtenerUsuarioPorDocumento(numero_documento) {
    return Usuario.usuarios.find(u => u.numero_documento === numero_documento);
  }

  static tieneVehiculoActivo(usuarioId) {
    const vehiculosActivos = Vehiculo.obtenerVehiculosActivosPorUsuario(usuarioId);
    return vehiculosActivos.length > 0;
  }

  static desactivarVehiculosUsuario(usuarioId) {
    Vehiculo.desactivarVehiculosUsuario(usuarioId);
  }

  // Método para inicializar datos de prueba
  static inicializarDatosPrueba() {
    if (Usuario.usuarios.length === 0) {
      Usuario.insertarUsuario({
        tipo_documento: 'CC',
        numero_documento: '123456789',
        nombre: 'Usuario Demo',
        correo: 'demo@parking.com',
        celular: '3001234567',
        tipo_usuario: 'usuario',
        password: 'user123' // CONTRASEÑA OBLIGATORIA
      });

      Usuario.insertarUsuario({
        tipo_documento: 'CC',
        numero_documento: 'admin001',
        nombre: 'Administrador',
        correo: 'admin@parking.com',
        celular: '3000000000',
        tipo_usuario: 'administrador',
        password: 'admin123'
      });

      Usuario.insertarUsuario({
        tipo_documento: 'CC',
        numero_documento: 'operador001',
        nombre: 'Operador',
        correo: 'operador@parking.com',
        celular: '3000000001',
        tipo_usuario: 'operador',
        password: 'operador123'
      });
    }
  }
}

export default Usuario;