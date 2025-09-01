import { Link } from "react-router-dom";
import { useLoginLogic } from "../logic/useLoginLogic";

const Login = () => {
  const {
    numeroDocumento,
    setNumeroDocumento,
    password,
    setPassword,
    error,
    handleSubmit
  } = useLoginLogic();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login Parking System</h2>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="numeroDocumento" className="form-label">
                    Número de Documento:
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="numeroDocumento" 
                    required 
                    value={numeroDocumento} 
                    onChange={(e) => setNumeroDocumento(e.target.value)} 
                    placeholder="Ej: 123456789"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña:
                  </label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Ingrese su contraseña"
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
                
                <p className="mt-3 text-center">
                  ¿No tienes una cuenta? <Link to="/registro">Regístrese</Link>
                </p>
                
                <div className="mt-3 p-3 bg-light rounded">
                  <small>
                    <strong>Datos de prueba:</strong><br/>
                    Admin: <code>admin001</code> (contraseña: admin123)<br/>
                    Operador: <code>operador001</code> (contraseña: operador123)<br/>
                    Usuario: <code>123456789</code> (contraseña: user123)
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>   
  );
};

export default Login;