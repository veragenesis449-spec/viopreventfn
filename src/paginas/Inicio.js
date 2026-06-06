import React from 'react';
import '../App.css';
import { FaUsers, FaSchool, FaFileAlt, FaExclamationTriangle, FaBell, FaCheckCircle } from 'react-icons/fa';
import { default as UltimosReportes } from './UltimosReportes'; // Importamos el nuevo componente

// El componente recibe todos los datos que necesita para los resúmenes
function Inicio({ alumnos, salones, reportes }) {
  // Calculamos los totales.
  const totalAlumnos = alumnos.length;
  const totalSalones = salones.length;
  const totalReportes = reportes.length;
  const reportesPendientes = reportes.filter(r => r.estado === 'Pendiente' || r.estado === 'En revisión').length;

  // Lógica para Alertas y Notificaciones
  const reportesFisicosPendientes = reportes.filter(r => r.tipo === 'Física' && r.estado === 'Pendiente').length;
  const reportesEnSeguimiento = reportes.filter(r => r.estado === 'En revisión').length;
  
  const hoy = new Date();
  const reportesResueltosMes = reportes.filter(r => {
    if (r.estado !== 'Resuelto' || !r.fecha) return false;
    const fechaReporte = new Date(r.fecha);
    return fechaReporte.getMonth() === hoy.getMonth() && fechaReporte.getFullYear() === hoy.getFullYear();
  }).length;

  return (
    <section className="content-area">
      <h1>Bienvenido al Panel de Control</h1>
      <p>Desde aquí podrás administrar la información clave de la institución.</p>

      {/* Contenedor para las tarjetas de estadísticas */}
      <div className="stats-cards-container">
        <div className="stat-card">
          <FaUsers className="stat-card-icon" />
          <div className="stat-card-info">
            <span className="stat-card-title">Total de Alumnos</span>
            <span className="stat-card-value">{totalAlumnos}</span>
            <span className="stat-card-subtitle">Alumnos registrados</span>
          </div>
        </div>
        <div className="stat-card">
          <FaSchool className="stat-card-icon" />
          <div className="stat-card-info">
            <span className="stat-card-title">Total de Salones</span>
            <span className="stat-card-value">{totalSalones}</span>
            <span className="stat-card-subtitle">Salones activos</span>
          </div>
        </div>
        <div className="stat-card">
          <FaFileAlt className="stat-card-icon" />
          <div className="stat-card-info">
            <span className="stat-card-title">Reportes Totales</span>
            <span className="stat-card-value">{totalReportes}</span>
            <span className="stat-card-subtitle">En todos los periodos</span>
          </div>
        </div>
        <div className="stat-card">
          <FaExclamationTriangle className="stat-card-icon" />
          <div className="stat-card-info">
            <span className="stat-card-title">Reportes Pendientes</span>
            <span className="stat-card-value">{reportesPendientes}</span>
            <span className="stat-card-subtitle">Requieren atención</span>
          </div>
        </div>
      </div>

      {/* Contenedor principal para alinear gráficos y alertas */}
      <div className="main-content-container">
        {/* Aquí irán los gráficos (a la izquierda) */}
        <div className="charts-container">
          {/* Próximamente: Gráficos */}
        </div>

        {/* Contenedor para Alertas y Notificaciones (a la derecha) */}
        <div className="alerts-notifications-container">
          <h2>Alertas y notificaciones</h2>
          <button className="notification-card alert-red">
            <FaBell />
            <div className="notification-info">
              <span className="notification-main-text"><b>{`${reportesFisicosPendientes} reportes`}</b> de violencia física</span>
              <span className="notification-sub-text">pendientes de atención.</span>
            </div>
            <span className="notification-arrow">&gt;</span>
          </button>
          <button className="notification-card alert-yellow">
            <FaBell />
            <div className="notification-info">
              <span className="notification-main-text"><b>{`${reportesEnSeguimiento} reportes`}</b> en seguimiento</span>
              <span className="notification-sub-text">requieren actualización.</span>
            </div>
            <span className="notification-arrow">&gt;</span>
          </button>
          <button className="notification-card alert-green">
            <FaCheckCircle />
            <div className="notification-info">
              <span className="notification-main-text"><b>{`${reportesResueltosMes} reportes`}</b> han sido</span>
              <span className="notification-sub-text">resueltos este mes.</span>
            </div>
            <span className="notification-arrow">&gt;</span>
          </button>
        </div>
      </div>

      {/* Tabla de Últimos Reportes */}
      <UltimosReportes reportes={reportes} />
    </section>
  );
}

export default Inicio;