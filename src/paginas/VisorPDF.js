import React from 'react';
import { Link } from 'react-router-dom';
import fondoHuellas from '../imagenes/huellas.jpeg'; // Importa la imagen de huellas

function VisorPDF() {
  const pdfPath = '/INFORME.pdf';
  const logoPath = '/logo.og.png'; // Asumiendo que el logo está en la carpeta public

  const styles = {
    page: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    },
    sidebar: {
      width: '25%', // Ancho de la barra lateral
      backgroundImage: `url(${fondoHuellas})`,
      backgroundSize: 'cover',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '50%', // Círculo para el logo
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      width: '200px',
      height: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      maxWidth: '120px',
    },
    mainContent: {
      width: '75%', // El contenido principal ocupa el resto del espacio
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f4f9',
    },
    navbar: {
      padding: '15px 30px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Sombra para dar profundidad
      zIndex: 1,
    },
    navLink: {
      textDecoration: 'none',
      color: '#007bff',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    pdfContainer: {
      flexGrow: 1,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img src={logoPath} alt="VioPrevent Logo" style={styles.logo} />
        </div>
      </div>
      <div style={styles.mainContent}>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.navLink}>
            &larr; Volver al Cuestionario
          </Link>
        </nav>
        <div style={styles.pdfContainer}>
          <object data={pdfPath} type="application/pdf" width="100%" height="100%">
            <p>
              Tu navegador no puede mostrar el PDF. En su lugar, puedes 
              <a href={pdfPath} target="_blank" rel="noopener noreferrer"> descargarlo aquí</a>.
            </p>
          </object>
        </div>
      </div>
    </div>
  );
}

export default VisorPDF;