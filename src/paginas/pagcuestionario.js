import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import fondoHuellas from '../imagenes/huellas.jpeg'; // Importa la imagen

function Cuestionario() {
  // Define el estilo del fondo para la sección hero
  const heroStyle = {
    backgroundImage: `url(${fondoHuellas})`
  };

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
            <li><Link to="/documento">Manual técnico</Link></li>
            <li><Link to="/documento2">¿A quien va dirigido?</Link></li>
            

          </ul>
        </nav>
        <Link to="/login" className="btn btn-start">Comenzar</Link>
      </header>

      <main className="hero-section" style={heroStyle}> {/* Aplica el estilo aquí */}
        <div className="hero-content">
          <span className="tagline">🐾 ¡Tu opinión importa!</span>
          <h1>Este cuestionario<br/>es para ti</h1>
          <p>Responde con sinceridad y ayúdanos a conocerte mejor.<br/>No hay respuestas correctas o incorrectas.</p>
          <div className="hero-buttons">
            <Link to="/formulario" className="btn btn-secondary-landing">Comenzar cuestionario <span className="paw-icon-small">🐾</span></Link>
            <a href="#" className="more-info">Más información &gt;</a>
          </div>
        </div>
      </main>

      <section className="features-section">
        <div className="feature-card">
          <div className="icon-circle">✓</div>
          <h3>Seguro y confidencial</h3>
          <p>Tus respuestas son anónimas y están protegidas.</p>
        </div>
        <div className="feature-card">
          <div className="icon-circle">🕒</div>
          <h3>Rápido y fácil</h3>
          <p>Toma solo unos minutos completarlo.</p>
        </div>
        <div className="feature-card">
          <div className="icon-circle">🎯</div>
          <h3>Mejores resultados</h3>
          <p>Tu participación nos ayuda a brindarte mejores experiencias.</p>
        </div>
        <div className="feature-card">
          <div className="icon-circle">❤️</div>
          <h3>Tu voz cuenta</h3>
          <p>Cada respuesta nos acerca a entenderte mejor.</p>
        </div>
      </section>

      <footer className="main-footer-landing">
        <p>🐾 Gracias por ser parte de este proceso. ❤️</p>
      </footer>
    </div>
  );
}

export default Cuestionario;