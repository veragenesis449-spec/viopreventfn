import React from 'react';
import '../styles/pagcuestionario.css';
import { Link } from 'react-router-dom';

function AQuienVaDirigido() {
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
            <li><Link to="/a-quien-va-dirigido" className="active">¿A quien va dirigido?</Link></li>
            <li><Link to="/manual-tecnico">Manual Tecnico</Link></li>
            <li><Link to="/">Politicas de Privacidad</Link></li>
          </ul>
        </nav>
        <Link to="/login" className="btn btn-start">Comenzar</Link>
      </header>

      <main className="cuestionario-container">
        <div className="cuestionario-header">
          <h2>¿A quién va dirigido?</h2>
        </div>

        <section>
          <p>
            <a href="/a%20quien%20va%20dirigido.pdf" target="_blank" rel="noopener noreferrer">Abrir PDF (a quien va dirigido)</a>
            &nbsp;|&nbsp;
            <a href="/a%20quien%20va%20dirigido.pdf" download>Descargar PDF</a>
          </p>

          <div style={{ marginTop: '1rem' }}>
            <iframe
              title="A quien va dirigido"
              src="/a%20quien%20va%20dirigido.pdf"
              style={{ width: '100%', height: '80vh', border: '1px solid #ddd' }}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default AQuienVaDirigido;
