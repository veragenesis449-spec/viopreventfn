import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './paginas/Login';
import Dashboard from './paginas/Dasboard';
import LandingPage from './paginas/pagcuestionario'; // Ruta corregida
import Formulario from './paginas/Formulario'; // Importar el nuevo componente
import VisorPDF from './paginas/VisorPDF';
import VisorPDF2 from './paginas/VisorPDF2';
import ManualTecnico from './paginas/ManualTecnico';
import AQuienVaDirigido from './paginas/AQuienVaDirigido';
import SobreCuestionario from './paginas/SobreCuestionario';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
  const [userName, setUserName] = useState('Juan Pérez'); // Estado para el nombre del usuario
  const navigate = useNavigate(); // Hook para la navegación

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role); // Guardar el rol del usuario
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null); // Limpiar el rol al cerrar sesión
    navigate('/login'); // Redirigir al login
  };

  // Función para actualizar el nombre del usuario
  const handleUpdateUserName = (newName) => {
    setUserName(newName);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} /> {/* Añadir la nueva ruta */}
  <Route path="/manual-tecnico" element={<ManualTecnico />} />
  <Route path="/a-quien-va-dirigido" element={<AQuienVaDirigido />} />
  <Route path="/sobre-el-cuestionario" element={<SobreCuestionario />} />
        <Route path="/documento" element={<VisorPDF />} />
        <Route path="/documento2" element={<VisorPDF2 />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} userRole={userRole} userName={userName} onUpdateUserName={handleUpdateUserName} /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} userRole={userRole} userName={userName} onUpdateUserName={handleUpdateUserName} /> : <Login onLogin={handleLogin} />} 
        />
      </Routes>
    </div>
  );
}

export default App;