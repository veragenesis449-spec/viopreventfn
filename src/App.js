import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './paginas/Login';
import Dashboard from './paginas/Dasboard';
import LandingPage from './paginas/pagcuestionario'; // Ruta corregida
import Formulario from './paginas/Formulario'; // Importar el nuevo componente
import VisorPDF from './paginas/VisorPDF';
import VisorPDF2 from './paginas/VisorPDF2';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login'); // Redirigir al login
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulario" element={<Formulario />} /> {/* Añadir la nueva ruta */}
        <Route path="/documento" element={<VisorPDF />} />
        <Route path="/documento2" element={<VisorPDF2 />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} 
        />
      </Routes>
    </div>
  );
}

export default App;