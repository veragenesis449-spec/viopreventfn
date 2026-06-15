import React from 'react';
import '../styles/pagcuestionario.css';
import { Link } from 'react-router-dom';
import '../App.css';

function Cuestionario() {
  return (
    <div className="landing-page">
      <header className="main-header-landing">
        <div className="logo">
          <span className="paw-icon">🐾</span>
          <div>
            <span className="logo-title">Cuestionario</span>
            <span className="logo-subtitle">Para conocerte mejor</span>
          </div>
        </div>
        <nav className="main-nav-landing">
          <ul>
            <li><a href="#" className="active">Inicio</a></li>
            <li><a href="#">Sobre el cuestionario</a></li>
            <li><a href="#">¿Cómo funciona?</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </nav>
        <Link to="/login" className="btn btn-start">Comenzar</Link>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <div className="tagline-wrapper">
            <span className="tagline">🐾 ¡Tu opinión importa!</span>
          </div>
          <h1>Este cuestionario<br/>es para ti</h1>
          <p>Responde con sinceridad y ayúdanos a conocerte mejor.<br/>No hay respuestas correctas o incorrectas.</p>
          <div className="hero-buttons">
            <Link to="/formulario" className="btn btn-secondary-landing">Comenzar cuestionario <span className="paw-icon-small">🐾</span></Link>
            <a href="#" className="more-info">Más información &gt;</a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cuestionario;
