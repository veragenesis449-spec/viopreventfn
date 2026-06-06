import React from 'react';
import { Link } from 'react-router-dom';
import fondoHuellas from '../imagenes/huellas.jpeg'; // Importar la imagen de huellas

function VisorPDF2() {
  // Apunta al segundo documento PDF. Asegúrate de que este archivo esté en la carpeta 'public'.
  const pdfPath = '/a quien va dirigido.pdf';

  const styles = {
    page: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#fff',
    },
    sidebar: {
      width: '20%',
      backgroundImage: `url(${fondoHuellas})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    mainContent: {
      width: '60%',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #eee',
      borderRight: '1px solid #eee',
    },
    navbar: {
      padding: '15px 30px',
      backgroundColor: '#ffffff',
      borderBottom: '2px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    navLink: {
      textDecoration: 'none',
      color: '#555',
      fontSize: '16px',
      fontWeight: '500',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'background-color 0.2s ease',
    },
    pdfContainer: {
      flexGrow: 1,
      backgroundColor: '#f4f4f4',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}></div>
      <div style={styles.mainContent}>
        <nav style={styles.navbar}>
          <Link to="/" style={styles.navLink} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            &larr; Volver al Cuestionario
          </Link>
        </nav>
        <div style={styles.pdfContainer}>
          <object data={pdfPath} type="application/pdf" width="100%" height="100%">
            <p>
              Tu navegador no puede mostrar el PDF. Asegúrate de que <strong>a quien va dirigido.pdf</strong> esté en la carpeta 'public'.
            </p>
          </object>
        </div>
      </div>
      <div style={styles.sidebar}></div>
    </div>
  );
}

export default VisorPDF2;