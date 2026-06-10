import React, { useState, useEffect } from 'react';
import '../styles/Reportes.css';
import '../App.css';
import GraficaGravedad from './GraficaGravedad'; // Importar el nuevo componente

function Reportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarGrafica, setMostrarGrafica] = useState(false); // Estado para la visibilidad de la gráfica

  useEffect(() => {
    fetch('http://localhost/VioPrevent/api/obtener_reportes.php')
      .then(res => res.json())
      .then(data => {
        setReportes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar reportes:", err);
        setLoading(false);
      });
  }, []);

  // Función para renderizar una tabla de reportes para un nivel de gravedad específico
  const renderReportesTable = (reportes, nivel) => {
    const filteredReportes = reportes.filter(r => r.nivel_gravedad && r.nivel_gravedad.toLowerCase() === nivel);
    
    if (filteredReportes.length === 0) {
      return <p>No hay reportes de gravedad {nivel}.</p>;
    }

    return (
      <table className="alumnos-table">
        <thead>
          <tr>
            <th>ID Reporte</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReportes.map((reporte) => (
            <tr key={reporte.id_reporte}>
              <td>{reporte.id_reporte}</td>
              <td>{reporte.descripcion}</td>
              <td>{new Date(reporte.fecha_reporte).toLocaleDateString()}</td>
              <td>
                <button className="action-button view-button">
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="alumnos-container">
      <div className="alumnos-header">
        <h2>Gestión de Informes</h2>
      </div>

      {loading ? (
        <p>Cargando reportes...</p>
      ) : (
        <div>
          <div className="report-section">
            <h3>Gravedad Alta</h3>
            {renderReportesTable(reportes, 'alta')}
          </div>
          <div className="report-section">
            <h3>Gravedad Media</h3>
            {renderReportesTable(reportes, 'media')}
          </div>
          <div className="report-section">
            <h3>Gravedad Baja</h3>
            {renderReportesTable(reportes, 'baja')}
          </div>

          {mostrarGrafica && (
            <div className="grafica-container" style={{ maxWidth: '400px', margin: '40px auto 0 auto' }}>
              <GraficaGravedad reportes={reportes} />
            </div>
          )}
        </div>
      )}

      <button 
        onClick={() => setMostrarGrafica(!mostrarGrafica)} 
        className="button-primary"
        style={{ marginTop: '20px' }}
      >
        {mostrarGrafica ? 'Ocultar Gráfica' : 'Mostrar Gráfica'}
      </button>
    </div>
  );
}

export default Reportes;