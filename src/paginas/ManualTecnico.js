import React from 'react';
import '../styles/pagcuestionario.css';
import { Link } from 'react-router-dom';

function ManualTecnico() {
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
            <li><Link to="/" className="">Inicio</Link></li>
            <li><Link to="/">Sobre el cuestionario</Link></li>
            <li><Link to="/">¿A quien va dirigido?</Link></li>
            <li><Link to="/manual-tecnico" className="active">Manual Tecnico</Link></li>
            <li><Link to="/">Politicas de Privacidad</Link></li>
          </ul>
        </nav>
        <Link to="/login" className="btn btn-start">Comenzar</Link>
      </header>

      <main className="cuestionario-container">
        <div className="cuestionario-header">
          <h2>Manual Técnico</h2>
        </div>

        <section>
          <p>
            <a href="/manual%20tecnico.pdf" target="_blank" rel="noopener noreferrer">Abrir Manual Técnico (PDF)</a>
            &nbsp;|&nbsp;
            <a href="/manual%20tecnico.pdf" download>Descargar Manual Técnico</a>
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            <iframe
              title="Manual Técnico"
              src="/manual%20tecnico.pdf"
              style={{ width: '100%', height: '80vh', border: '1px solid #ddd' }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManualTecnico;
