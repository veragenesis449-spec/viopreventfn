import React from 'react';
import '../App.css';

// Función para dar formato a la fecha como DD/MM/AAAA
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Sumar un día porque new Date() puede interpretarlo como el día anterior por la zona horaria
  date.setDate(date.getDate() + 1);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Función para convertir un texto a un nombre de clase CSS válido
// ej: "En revisión" -> "en-revision"
const toClassName = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/[áäàâ]/g, 'a')
    .replace(/[éëèê]/g, 'e')
    .replace(/[íïìî]/g, 'i')
    .replace(/[óöòô]/g, 'o')
    .replace(/[úüùû]/g, 'u');
};

function UltimosReportes({ reportes }) {
  // Ordenamos los reportes por fecha (los más nuevos primero) y tomamos los 5 primeros
  const ultimosReportes = [...reportes]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div className="section-container">
      <h2 className="section-title">Últimos reportes recibidos</h2>
      <div className="ultimos-reportes-container">
        <table className="ultimos-reportes-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo de violencia</th>
              <th>Alumno</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ultimosReportes.map((reporte) => (
              <tr key={reporte.id}>
                <td>{formatDate(reporte.fecha)}</td>
                <td>
                  <span className={`badge-tipo badge-${toClassName(reporte.tipo)}`}>
                    {reporte.tipo}
                  </span>
                </td>
                <td>{reporte.alumno}</td>
                <td>{reporte.lugar}</td>
                <td>
                  <span className={`badge-estado status-${toClassName(reporte.estado)}`}>
                    {reporte.estado}
                  </span>
                </td>
                <td>
                  <button className="action-button action-view">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <a href="#" className="ver-todos-link">
          Ver todos los reportes &gt;
        </a>
      </div>
    </div>
  );
}

export default UltimosReportes;