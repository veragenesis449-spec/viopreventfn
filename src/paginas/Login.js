import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Importar Link
import '../App.css';
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate(); // Hook para la navegación
  // Estados para guardar el correo y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('director'); // Estado para el rol

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que la página se recargue
    // Aquí, en un futuro, deberías añadir la lógica para verificar
    // el email y la contraseña contra tu backend o base de datos.

    // Por ahora, simulamos que el inicio de sesión es siempre exitoso.
    onLogin(role); // Llama a la función del componente padre con el rol.
    navigate('/dashboard'); // Redirige al usuario a la página del dashboard.
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1 className="login-brand-title">VioPrevent</h1>
        <h1 className="login-title">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="director">Directivos</option>
              <option value="orientador">Orientadores</option>
            </select>
          </div>
          <button type="submit" className="button-primary login-submit-btn">Ingresar</button>
        </form>
        <div className="login-footer-links">
          {/* Enlace de recuperar contraseña eliminado por solicitud */}
        </div>

        {/* 2. Añadir el nuevo enlace para volver */}
        <div className="back-to-home-link">
          <Link to="/">Volver a la página principal</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;