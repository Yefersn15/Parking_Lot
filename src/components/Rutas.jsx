import { Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import DashBord from '../pages/DashBord';
import Parking from '../pages/ParkinGrid';
import GestionVehiculos from "../pages/GestionVehiculos";

const Rutas = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/gestion-vehiculos" element={<GestionVehiculos />} />
            <Route path="/DashBord" element={<DashBord />} />
            <Route path="/Parking" element={<Parking />} />
        </Routes>
    )
}

export default Rutas;